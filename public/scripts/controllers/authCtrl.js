(function(){
  angular
    .module('app')
    .controller('AuthCtrl', AuthCtrl);

  AuthCtrl.$inject = ['$scope', 'authSvc', '$location', 'notificationSvc'];

  function AuthCtrl($scope, authSvc, $location, notificationSvc){
    $scope.user = {};

    $scope.register = register;
    $scope.logIn = logIn;
    $scope.facebookLogin = facebookLogin;

    function register(){
      authSvc.register($scope.user).error(function(error){
        notificationSvc.error(error.message);
      }).then(function(){

        $location.path('/');
        $scope.$root.$broadcast('userRegistered', {});
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
})();
