//HTTP Response status code
/*
**  200's are used for successful requests.
**  300's are for redirections.
**  400's are used if there was a problem with the request.
**  500's are used if there was a problem with the server.
*/

var express = require('express');
var path = require('path');
var router = express.Router();
var passport = require('passport');
var appDir = path.dirname(require.main.filename);

function init(io){
  // middleware to use for all requests
  router.use(function(req, res, next) {
    console.log('middleware called');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Access-Control-Allow-Origin');
    res.header("Access-Control-Max-Age", "86400"); // 24 hours

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
  });

  router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  //Other routes goes here
  //....
  //....
  //....

  //This route must be place at the bottom, If not match any routes it will use this route
  router.get('*', function(req, res){
    res.sendFile('index.html', {root: path.join(appDir, 'public')});
  });

  return router;
}


module.exports = init;

