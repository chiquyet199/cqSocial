(function(){

  angular
    .module('app')
    .controller('UserCtrl', UserCtrl);

  UserCtrl.$inject = ['$scope', 'userSvc', 'notificationSvc', 'socketIO', 'authSvc'];

  function UserCtrl($scope, userSvc, notificationSvc, socketIO, authSvc){
    $scope.childData.users = [];
    getAllUsers();

    $scope.isFriend = isFriend;
    $scope.isCurrentUser = isCurrentUser;
    $scope.getAllUsers = getAllUsers;
    $scope.friendRequest = friendRequest;
    $scope.acceptFriendRequest = acceptFriendRequest;


    socketIO.on('haveFriendRequest', function(friendRequest){
      if(authSvc.isLoggedIn()){
        $scope.friendRequests.push(friendRequest)
        notificationSvc.info(friendRequest.sender.username + ' send you a friend request!');
      }
    });

    socketIO.on('haveFriendAccept', function(data){
      notificationSvc.info(data.receiver + ' has accept your friend request!');
      var scopeUser = getScopeUser();
      scopeUser.friends.push(data.receiver);
    });

    function getScopeUser(user){
      var username = user ? user.username : authSvc.currentUser().username;
      return $scope.childData.users.filter(function(user){
        return user.username === username;
      })[0];
    }

    function isFriend(user) {
      if(authSvc.isLoggedIn()){
        var scopeUser = getScopeUser();
        return scopeUser.friends.map(function(x){return x.username;}).indexOf(user.username) >= 0;
      }
    }

    function isCurrentUser(user){
      if(authSvc.isLoggedIn()){
        var username = authSvc.currentUser().username;
        return user.username === username;
      }
    }

    function getAllFriendRequests(){
      var username = authSvc.currentUser().username;

      for(var i = 0; i < $scope.childData.users.length; i++){
        if($scope.childData.users[i].username === username){
          return $scope.childData.users[i].friendRequests;
        }
      }

      return [];
    }

    function getAllUsers(){
      userSvc.getAllUsers().success(function(data){
        $scope.childData.users = data;
        $scope.$root.$broadcast('gotUsers', $scope.users);
        $scope.friendRequests = getAllFriendRequests();
      }).error(function(err){
        notificationSvc.error(err.mes);
      });
    }

    function isRequestSent(receiver){
      var scopeReceiver = getScopeUser(receiver);
      var idx = scopeReceiver.friendRequests.map(function(fr){
        return fr.sender.username;
      }).indexOf(authSvc.currentUser().username);
      return idx >= 0;
    }

    function friendRequest(receiver){
      var sender = authSvc.currentUser();
      if(!isFriend(receiver) && !isRequestSent(receiver)){
        var friendRequest = {
          sender: sender,
          accept: false
        };
        var userId = receiver._id;

        userSvc.saveFriendRequest(friendRequest, userId).error(function(err){
          console.log('err on save friend request: ', err);
        }).success(function(){
          socketIO.emit('friendRequest', {sender: sender, receiver: receiver, friendRequest: friendRequest});
        });
      }
    }

    function acceptFriendRequest(friendRequest){
      var userId = authSvc.currentUser()._id;
      userSvc.acceptFriendRequest(friendRequest, userId).error(function(err){
        console.log(err);
        notificationSvc.error('Open console to see error!');
      }).success(function(data){
        //remove friend request
        var idx = $scope.friendRequests.map(function(fr){ return fr.sender._id; }).indexOf(data._id);
        if(idx >= 0){
          $scope.friendRequests.splice(idx, 1);
        }

        //add friend
        var scopeUser = getScopeUser();
        scopeUser.friends.push(data);

        socketIO.emit('friendAccept', {sender: data, receiver: authSvc.currentUser()});
      });
    }

  }

})();
