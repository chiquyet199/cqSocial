(function(){
  angular
    .module('app')
    .controller('NavCtrl', NavCtrl);

  NavCtrl.$inject = ['$scope', 'authSvc', '$state'];

  function NavCtrl($scope, authSvc, $state){
    $scope.isLoggedIn = authSvc.isLoggedIn;
    $scope.username = $scope.isLoggedIn() ? authSvc.currentUser().username : '';
    $scope.logOut = logOut;

    function logOut(){
      authSvc.logOut();
      $state.go('login');
    }

    $scope.$on('userRegistered', function(){
      $scope.username = $scope.isLoggedIn() ? authSvc.currentUser().username : '';
    });
  }
})();
