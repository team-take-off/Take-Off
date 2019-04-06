const ADMINISTRATOR_ROLE_ID = 1;

const rejectUnauthenticated = (req, res, next) => {
  // check if logged in
  if (req.isAuthenticated()) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
    next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
};

const rejectNonAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role_id === ADMINISTRATOR_ROLE_ID) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { rejectUnauthenticated, rejectNonAdmin };
