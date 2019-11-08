User = require('../classes/User');

const rejectUnauthenticated = (req, res, next) => {
  // check if logged in
  const user = new User(req.user);
  if (req.isAuthenticated() && user.active) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
    next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
};

const rejectNonAdmin = (req, res, next) => {
  const user = new User(req.user);
  if (req.isAuthenticated() && user.isAdministrator()) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { rejectUnauthenticated, rejectNonAdmin };
