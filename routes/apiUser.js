var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

function init(io){
  router.route('/')

    .get(function(req, res, next){
      User.find(function(err, users){
        if(err){ return next(err); }
        var safeUsers = [];
        for(var i = 0; i < users.length; i++){
          var safeUser = {
            _id: users[i]._id,
            username: users[i].local.username,
            friendRequests: users[i].friendRequests,
            friends: users[i].friends
          };
          safeUsers.push(safeUser);
        }
        res.json(safeUsers);
      });
    });

  router.param('user_id', function(req, res, next, id){
    var query = User.findById(id);

    query.exec(function(err, user){
      if(err){ return next(err); };
      if(!user){ return next(new Error('Can not find user!')); }
      req.user = user;
      return next();
    });
  });

  router.route('/:user_id/addfriend')

    .post(function(req, res){
      var sender = req.body.sender;
      var senderUser = User.find({ _id: sender._id});
      //senderUser add friendback
      req.user.addFriend(sender, function(err){
        if(err){ return next(err); }
        res.json(sender);
      });
    });

  router.route('/:user_id/friendrequest')

    .post(function(req, res){
      var friendRequest = req.body;
      req.user.saveFriendRequest(friendRequest, function(err){
        if(err){ return next(err); }
        res.json(friendRequest);
      });
    });

  router.route('/:user_id')

    .get(function(req, res){
      var safeUser = {
        _id: req.user._id,
        username: req.user.local.username,
        friendRequests: req.user.friendRequests,
        friends: req.user.friends
      };
      res.json(safeUser);
    })

    .put(auth, function(req, res, next){
      //Edit user profile: Not implemented
    })

    .delete(auth, function(req, res, next){
      //Delete user profile: Not emplemented
    });

  return router;
}

module.exports = init;




