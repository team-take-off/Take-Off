const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const googleStrategy = require('passport');
const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

router.get('/auth/google', googleStrategy.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));
//if login is successful, we will recieve the information and then redirected to the homepage

router.get('/auth/google/callback', googleStrategy.authenticate('google', {
  successRedirect: process.env.SUCCESS_REDIRECT,
  failureRedirect: process.env.FAIL_REDIRECT
}));

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
