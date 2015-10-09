(function(){
  angular
    .module('app')
    .directive('post', post);

  function post(){
    return {
      restrict: 'E',
      templateUrl: './views/partial/post.html',
      replace: true,
      scope: {
        postObj: '='
      },
      controller: 'PostCtrl',
      link: function(scope, element, attrs){
        var commentEl = angular.element(element[0].getElementsByClassName('comment'));
        var commentBtn = angular.element(element[0].getElementsByClassName('glyphicon-comment'));

        commentBtn.on('click', function(){
          commentEl.toggleClass('active');
        });
      }
    }
  }
})();
