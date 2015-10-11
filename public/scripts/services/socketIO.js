(function(){
  angular
    .module('app')
    .factory('socketIO', socketIO);

  socketIO.$inject = ['$rootScope'];

  function socketIO($rootScope){
    var socket = io.connect('http://localhost:3000');
    // var socket = io.connect('http://10.0.2.212:3000');
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  }
})();
