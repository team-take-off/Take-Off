Employee = require('../classes/User');

const rejectUnauthenticated = (req, res, next) => {
  // check if logged in
  const employee = new Employee(req.user);
  if (req.isAuthenticated() && employee.active) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
    next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
};

const rejectNonAdmin = (req, res, next) => {
  const employee = new Employee(req.user);
  if (req.isAuthenticated() && employee.isAdministrator()) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { rejectUnauthenticated, rejectNonAdmin };
