
angular
  .module('app')
  .filter('reverse', reverse);

function reverse(){
  return function(items){
    return items.slice().reverse();
  };
}