
const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/google.strategy');

// Route includes
const accruedTimeRouter = require('./routes/accruedTime.router');
const employeeRouter = require('./routes/employee.router');
const requestRouter = require('./routes/request.router');
const userRouter = require('./routes/user.router');


if(process.env.NODE_ENV === 'development') {
  app.use(cors());
}
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/accrued-time', accruedTimeRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/request', requestRouter);
app.use('/api/user', userRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;



/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
