(function(){

  angular
    .module('app')
    .controller('UserCtrl', UserCtrl);

  UserCtrl.$inject = ['$scope', 'userSvc', 'notificationSvc', 'socketIO'];

  function UserCtrl($scope, userSvc, notificationSvc, socketIO){
    $scope.users = [];

    $scope.getAllUsers = getAllUsers;
    $scope.friendRequest = friendRequest;

    getAllUsers();

    function friendRequest(friend){
      socketIO.emit('friendRequest', friend);
    }

    function getAllUsers(){
      userSvc.getAllUsers().success(function(data){
        $scope.users = data;
      }).error(function(err){
        notificationSvc.error(err.mes);
      });
    }

  }

})();
