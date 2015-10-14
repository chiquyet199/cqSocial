var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
  local: {
    username: {type: String, unique: true},
    hash: String,
    salt: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  friendRequests: [],
  friends: []
});

UserSchema.methods.setPassword = function(password){
  this.local.salt = crypto.randomBytes(16).toString('hex');
  this.local.hash = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password){
  var hash = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64).toString('hex');

  return this.local.hash === hash;
};

UserSchema.methods.saveFriendRequest = function(friendRequest, cb){

  var isExist = this.friendRequests.filter(function(fr){
    return fr.sender._id === friendRequest.sender._id;
  }).length > 0;

  if(isExist){
    this.save(cb);
    return;
  }

  this.friendRequests.push(friendRequest);
  this.save(cb);
}

UserSchema.methods.addFriend = function(friend, cb){
  var isExist = this.friends.filter(function(fr){
    return fr._id === friend._id;
  }).length > 0;

  if(isExist){
    this.save(cb);
    return;
  }

  //add friend
  this.friends.push(friend);

  //check and remove friend request
  var idx = this.friendRequests.map(function(x){ return x.sender._id; }).indexOf(friend._id);
  if (idx >= 0) {
    this.friendRequests.splice(idx, 1);
  };

  //done
  this.save(cb);
}

UserSchema.methods.generateJWT = function(username){
  //set expiration to 1 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 1);

  return jwt.sign({
    _id: this._id,
    username: username,
    exp: parseInt(exp.getTime() / 1000)
  }, 'SECRET');
};

/*
The first argument of the jwt.sign() method is the payload that gets signed.
Both the server and client will have access to the payload. The exp value in
the payload is a Unix timestamp in seconds that will specify when the token
expires. For this example we set it to 1 days in the future. The second
argument of jwt.sign() is the secret used to sign our tokens. We're hard-coding
it in this example, but it is strongly recommended that you use an environment
variable for referencing the secret and keep it out of your codebase.
*/

mongoose.model('User', UserSchema);
