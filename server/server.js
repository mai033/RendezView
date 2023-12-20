const express = require('express');
const path = require('path');
// const cors = require('cors');
const eventController = require('./controllers/eventController');

const app = express();

app.use(express.json());
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'build')));

// app.get('/availability/:link', (req, res) => {
//   // send a flag to the frontend, to only conditionally render the weekly schedule and NOT the create event components
//   res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
// });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.post('/test', (req, res) => {
  res.send(req.body);
})
app.get('/availability/:link', eventController.getAvailabilityPage);

// app.get('/availability/:eventUuid', eventController.getEventAvailability);

app.post('/', eventController.addEvent);

app.post('/availability/:eventUuid', eventController.addUserAvailability);

app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

// global error handler // does the router
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.error(errorObj.log); // Log the error to console
  return res.status(errorObj.status).json(errorObj.message);
});

// Start the server
const port = 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
