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
      friendRequest: function(friend){
        var userId = authSvc.currentUser()._id;
        return $http.post('/api/');
      }
    };
  }

})();
