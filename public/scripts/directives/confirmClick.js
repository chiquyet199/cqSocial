
angular
  .module('app')
  .directive('confirmClick', confirmClick);

function confirmClick(){
  return {
    link: function(scope, element, attrs){
      var msg = attrs.confirmMsg || 'Are you sure?';
      var clickAction = attrs.confirmClick;
      element.on('click', function(){
        if(window.confirm(msg)){
          scope.$eval(clickAction);
        }
      });
    }
  };
}