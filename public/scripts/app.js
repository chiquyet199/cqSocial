var app = angular.module('app', ['ui.router', 'toastr']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'MainCtrl',
      onEnter: ['$state', 'authSvc', function($state, authSvc){
        if(!authSvc.isLoggedIn()){
          $state.go('login');
        }
      }]
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'authSvc', function($state, authSvc){
        if(authSvc.isLoggedIn()){
          $state.go('home');
        }
      }]
    }).state('register', {
      url: '/register',
      templateUrl: 'views/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'authSvc', function($state, authSvc){
        if(authSvc.isLoggedIn()){
          $state.go('home');
        }
      }]
    });

    $urlRouterProvider.otherwise('/');

    //Pretty URLs , removing the hash (#)
    //doc: https://scotch.io/quick-tips/pretty-urls-in-angularjs-removing-the-hashtag
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}]);

// app.config(['$httpProvider', function($httpProvider) {
//     $httpProvider.defaults.useXDomain = true;
//     delete $httpProvider.defaults.headers.common['X-Requested-With'];
//   }
// ]);

//ROUTING WITH ANGULAR ROUTE ===========================================================================

// var app = angular.module('app', ['ngRoute', 'toastr']);

// app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
//   $routeProvider
//     .when('/', {
//       templateUrl: 'views/login.html',
//       controller: 'authCtrl'
//     })
//     .when('/register', {
//       templateUrl: 'views/register.html',
//       controller: 'authCtrl'
//     })
//     .when('/login', {
//       templateUrl: 'views/login.html',
//       controller: 'authCtrl'
//     });

//     $locationProvider.html5Mode({
//       enabled: true,
//       requireBase: false
//     });
// }]);
