// set up ===================================================================================================
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var mongoose = require('mongoose');                 //Working with mongodb
var passport = require('passport');
var morgan = require('morgan');                     //Log request to console
var bodyParser = require('body-parser');            //Pull information from HTML POST
var methodOverride = require('method-override');    //Simulate DELETE and PUT
var port = process.env.port || 3000;                //Set port
var publicDir = path.join(__dirname, 'public');

var cors = require('cors');
app.use(cors({credentials: true, origin: true}));

//socket set up =============================================================================================
var io = require('./sockets')(http);

// views set up =============================================================================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// database set up ==========================================================================================
var dbConfig = require('./configs/db');
require('./models/Posts');
require('./models/Comments');
require('./models/Users');
require('./configs/passport');
app.use(passport.initialize());
mongoose.connect(dbConfig.url);


// configuration ============================================================================================
app.use(express.static(publicDir));
app.use(morgan('dev'));                             //Only log info in dev enviroment
app.use(bodyParser.json());                                       // parse application/json
app.use(bodyParser.urlencoded({ 'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));    // parse application/vnd.api+json as json

// route ====================================================================================================
var indexRouter = require('./routes/index')(io);
var apiRouter = require('./routes/api')(io);
var authRouter = require('./routes/auth')(io);
app.use('/api/posts', apiRouter);
app.use('/', authRouter)
app.get('*', indexRouter);

// error handler ============================================================================================
// catch 404 and forward to error handler
app.use(function(req, res, next){
  var err = new Error('Not Found!');
  err.status = 404;
  next(err);
});

// development error handler will print stacktrace
// production error handler no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});


// start app ================================================================================================
http.listen(port, function(){
  console.log('Your server is running on', port);
});

