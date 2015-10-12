var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var router = express.Router();

function init(io){
  router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
      return res.status(400).json({message: 'Please fill out all fields!'});
    }
    passport.authenticate('local', function(err, user, info){
      if(err){ return next(err);}
      if(user){
        var token = user.generateJWT(user.local.username);
        var usernameBase = token.split('.')[1];
        var username = (new Buffer(usernameBase, 'base64')).toString('utf-8');
        var friends = user.friends;
        return res.json({token: token, username: username, friends: friends});
      }else{
        return res.status(401).json(info);
      }
    })(req, res, next);
  });

  var usernameExisted = function(username){
    User.findOne({'local.username': username}, function(err, user){
      if(err){ return new Error('Something wrong happened!'); }
      return user;
    });
    return false;
  };

  router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
      return res.status(400).json({message: 'Please fill out all fields!'});
    }

    if (usernameExisted(req.body.username)) {
      return res.status(500).json({message: 'Username already exist! Please choose another username!'});
    }

    var user = new User();
    user.local.username = req.body.username;
    user.setPassword(req.body.password);
    user.friends = [];

    user.save(function(err){
      if(err){ return next(err); }
      var token = user.generateJWT(user.local.username);
      var usernameBase = token.split('.')[1];
      var username = (new Buffer(usernameBase, 'base64')).toString('utf-8');
      var friends = user.friends;
      return res.json({token: token, username: username, friends: friends});
    });
  });

  return router;
}

module.exports = init;
