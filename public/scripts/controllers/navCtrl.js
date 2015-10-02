
angular
  .module('app')
  .controller('navCtrl', navCtrl);

navCtrl.$inject = ['$scope', 'authSvc', '$state'];

function navCtrl($scope, authSvc, $state){
  $scope.isLoggedIn = authSvc.isLoggedIn;
  $scope.currentUser = authSvc.currentUser;
  $scope.logOut = logOut;

  function logOut(){
    authSvc.logOut();
    $state.go('login');
  }
}
