var socketio = require('socket.io');

function init(server) {
  var io = socketio(server);
  io.on('connection', function (socket) {
    socket.on('newEvent', function (data) {
      console.log(data);
    });
  });
  return io;
}

module.exports = init;
