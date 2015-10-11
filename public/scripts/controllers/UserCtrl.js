(function(){

  angular
    .module('app')
    .controller('UserCtrl', UserCtrl);

  UserCtrl.$inject = ['$scope', 'userSvc', 'notificationSvc', 'socketIO', 'authSvc'];

  function UserCtrl($scope, userSvc, notificationSvc, socketIO, authSvc){
    $scope.users = [];
    getAllUsers();

    $scope.getAllUsers = getAllUsers;
    $scope.friendRequest = friendRequest;
    $scope.acceptFriendRequest = acceptFriendRequest;


    socketIO.on('haveFriendRequest', function(sender){
      var friendRequest = {
        sender: sender,
        accept: false
      };

      //save friend request to database
      userSvc.saveFriendRequest(friendRequest).error(function(err){
        console.log('err on save friend request: ', err);
      }).success(function(){
        $scope.friendRequests.push(friendRequest);
        notificationSvc.info(friendRequest.sender.username + ' send you a friend request!');
      });

    });

    socketIO.on('haveFriendAccept', function(data){
      notificationSvc.info(data.receiver + ' has accept your friend request!');
    });

    function getAllFriendRequests(){
      var username = authSvc.currentUser().username;

      for(var i = 0; i < $scope.users.length; i++){
        if($scope.users[i].username === username){
          return $scope.users[i].friendRequests;
        }
      }

      return [];
    }

    function getAllUsers(){
      userSvc.getAllUsers().success(function(data){
        $scope.users = data;
        $scope.friendRequests = getAllFriendRequests();
      }).error(function(err){
        notificationSvc.error(err.mes);
      });
    }

    function friendRequest(receiver){
      var sender = authSvc.currentUser();
      socketIO.emit('friendRequest', {sender: sender, receiver: receiver});
    }

    function acceptFriendRequest(friendRequest){
      userSvc.acceptFriendRequest(friendRequest).error(function(err){
        console.log(err);
        notificationSvc.error('Open console to see error!');
      }).success(function(data){
        //remove friend request
        var idx = $scope.friendRequests.map(function(x){ return x.sender._id; }).indexOf(data._id);
        if(idx >= 0){
          $scope.friendRequests.splice(idx, 1);
        }
        
        socketIO.emit('friendAccept', {sender: data, receiver: authSvc.currentUser().username});
      });
    }

  }

})();
