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
      saveFriendRequest: function(friendRequest, userId){
        return $http.post('/api/users/' + userId + '/friendrequest', friendRequest);
      },
      acceptFriendRequest: function(friend, userId){
        return $http.post('/api/users/' + userId + '/addfriend', friend);
      }
    };
  }

})();
