var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var configAuth = require('./socialAuth');
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      User.findOne({'facebook.id': profile.id}, function(err, user){
        if(err){
          return done(err);
        }
        if(user){
          return done(null, user)
        }else{
          var newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = accessToken;
          newUser.facebook.email = profile.emails[0].value;
          newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;

          newUser.save(function(err){
            if(err){
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }
));

passport.use(new LocalStrategy(
  function(username, password, done){
    User.findOne({ 'local.username': username}, function(err, user){
      if(err){ return done(err); }
      if(!user){
        return done(null, false, { message: 'Incorrect username'});
      }
      if(!user.validPassword(password)){
        return done(null, false, { message: 'Incorrect password'});
      }
      return done(null, user);
    });
  }
));


/*
**  DOCUMENT FOR OAUTH WITH FACEBOOK
      1- Get credential from developers.facebook.com
        Click on 'My Apps'
        Click on '+ Add a New App'
        Select 'Website'
        Type your app's name
        Click 'Create New Facebook App ID'
        Choose Communication from Category dropdown
        Click 'Create App ID'
        Click 'Skip Quick Start'
        Switch to Setting tab and provide email address, 'Add Platform' -> Website
        App Domain: localhost
        Under site URL: http://localhost/ => save changes
        Switch to Status & Review tab and confirm make app available for public. No -> Yes
        Go back to Dashboard to see App ID and App Secret

      2- Install passport
        nmp install passport-facebook --save
        make a file contain fb ID and secret
        socialAuth.js
          module.export = {
            'facebookAuth': {
              'clientID': '<App ID goes here>',
              'clientSecret': '<App Secret goes here>',
              'callbackURL': '<URL for fb redirect whether your app authorize or not>' Ex: 'http://localhost:3000/auth/facebook/callback'
            }
          }
        Go to http:passportjs.org/guide/facebook scrool to Routes section and copy the routes we need
      3- Set up strategy for facebook login

*/
