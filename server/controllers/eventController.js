const uuid = require('uuid');
const db = require('../models/calendarModels');

const eventController = {};

eventController.addEvent = async (req, res, next) => {
  try {
    const {
      organizer_name,
      meeting_name,
      meeting_description,
      location,
      date,
      time,
    } = req.body;

    const dateTimeString = `${date} ${time}`;

    const insertQuery = `
      INSERT INTO events (organizer_name, meeting_name, meeting_description, location, event_time)
      VALUES ($1, $2, $3, $4, $5, TO_TIMESTAMP($6, 'YYYY-MM-DD HH24:MI:SS'))
      RETURNING event_id;
    `;

    const result = await db.query(insertQuery, [
      organizer_name,
      meeting_name,
      meeting_description,
      location,
      dateTimeString,
    ]);

    const eventId = result.rows[0].event_id;

    // Generate a UUID for the event
    const eventUuid = uuid.v4();
    const link = `http://localhost:5001/availability/${eventUuid}`;
    res.locals.eventLink = link;
    console.log('Event added successfully. Link:', link);
    res.status(201).json({ eventId, eventUuid });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

eventController.addUserAvailability = async (req, res, next) => {
  try {
    const { user_name, event_id, available_date, available_time } = req.body;

    // Add logic to validate the input if necessary

    const insertQuery = `
            INSERT INTO availability (user_name, event_id, available_date, available_time)
            VALUES ($1, $2, $3, $4)
            RETURNING availability_id;
        `;

    const result = await db.query(insertQuery, [
      user_name,
      event_id,
      available_date,
      available_time,
    ]);

    const availabilityId = result.rows[0].availability_id;

    console.log('User availability added successfully');
    res.status(201).json({ availabilityId });
  } catch (error) {
    console.error('Error adding user availability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = eventController;
