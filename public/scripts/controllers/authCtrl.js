
angular
  .module('app')
  .controller('authCtrl', authCtrl);

authCtrl.$inject = ['$scope', 'authSvc', '$location', 'notificationSvc'];

function authCtrl($scope, authSvc, $location, notificationSvc){
  $scope.user = {};

  $scope.register = register;
  $scope.logIn = logIn;
  $scope.facebookLogin = facebookLogin;

  function register(){
    authSvc.register($scope.user).error(function(error){
      notificationSvc.error(error.message);
    }).then(function(){
      $location.path('/');
    });
  }

  function logIn(){
    authSvc.logIn($scope.user).error(function(error){
      notificationSvc.error(error.message);
    }).then(function(){
      $location.path('/');
    });
  }

  function facebookLogin(){
    authSvc.facebookLogin().error(function(error){
      notificationSvc.error('error happened');
    }).then(function(){
      $location.path('/');
    });
  }
}
