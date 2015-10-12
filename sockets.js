var socketio = require('socket.io');

function init(server) {
  var io = socketio(server);
  io.on('connection', function (socket) {
    socket.on('join', function (data) {
      socket.join(data.id);
    });
    socket.on('friendRequest', function(data){
      var id = data.receiver._id;
      io.sockets.in(id).emit('haveFriendRequest', data.friendRequest);
    })
    socket.on('friendAccept', function(data){
      var id = data.sender._id;
      io.sockets.in(id).emit('haveFriendAccept', data);
    })
    socket.on('postCmt', function(data){
      socket.broadcast.emit('postCommented', data);
    });
  });
  return io;
}

module.exports = init;
