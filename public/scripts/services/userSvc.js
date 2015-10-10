(function(){

  angular
    .module('app')
    .factory('userSvc', userSvc);

  userSvc.$inject = ['$http', 'authSvc'];

  function userSvc($http, authSvc){
    return {
      getAllUsers: function(){
        return $http.get('/api/users');
      },
      saveFriendRequest: function(friendRequest){
        var userId = authSvc.currentUser()._id;
        return $http.post('/api/users/' + userId + '/friendrequest', friendRequest);
      },
      acceptFriendRequest: function(friend){
        var userId = authSvc.currentUser()._id;
        return $http.post('/api/users/' + userId + '/addfriend', friend);
      }
    };
  }

})();
