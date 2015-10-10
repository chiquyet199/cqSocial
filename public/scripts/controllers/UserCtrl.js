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
        notificationSvc.error('err');
      }).success(function(data){
        for(var i = 0; i < $scope.friendRequests.length; i++){
          if($scope.friendRequests[i].sender._id === data.sender._id){
            $scope.friendRequests.pop($scope.friendRequests[i]);
          }
        }
        socketIO.emit('friendAccept', {sender: data, receiver: authSvc.currentUser().username});
      });
    }

  }

})();
