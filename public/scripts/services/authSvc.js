(function(){
  angular
    .module('app')
    .factory('authSvc', authSvc);

  authSvc.$inject = ['$http', '$window'];

  function authSvc($http, $window){
    var auth = {
      facebookLogin: function(){
        return $http.get('/auth/facebook');
      },
      saveToken: function(data){
        $window.localStorage['app-token'] = data.token;
        $window.localStorage['username'] = JSON.parse(data.username).username;
      },
      getToken: function(){
        return $window.localStorage['app-token'];
      },
      isLoggedIn: function(){
        var token = auth.getToken();
        if(token){
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          return payload.exp > Date.now() /1000;
        }
        return false;
      },
      currentUser: function(){
        if(auth.isLoggedIn()){
          var token = auth.getToken();
          if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return {
              _id: payload._id,
              username: $window.localStorage['username']
            };
          }
          return {};
        }
      },
      register: function(user){
        return $http.post('/register', user).success(function(data){
          auth.saveToken(data);
        });
      },
      logIn: function(user){
        return $http.post('/login', user).success(function(data){
          auth.saveToken(data);
        });
      },
      logOut: function(){
        $window.localStorage.removeItem('app-token');
        $window.localStorage.removeItem('username');
      }
    };
    return auth;
  }

  /* =====isLoggedIn()=====
  If a token exists, we'll need to check the payload to see if the token has expired,
  otherwise we can assume the user is logged out. The payload is the middle part of
  the token between the two .s. It's a JSON object that has been base64'd. We can get
  it back to a stringified JSON by using $window.atob(), and then back to a javascript
  object with JSON.parse.
  */
})();

