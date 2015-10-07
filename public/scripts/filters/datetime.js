angular
  .module('app')
  .filter('datetime', datetime);

datetime.$inject = ['$filter'];

function datetime($filter){
  return function(input){
    if(input === null || input === void 0){
      return '';
    }

    var now = new Date().getTime();
    var time = new Date(input).getTime();
    var secondDiff = Math.floor((now - time)/1000);

    if(secondDiff < 60){
      return 'just now';
    }

    var minuteDiff = Math.floor(secondDiff / 60);
    if(minuteDiff < 60){
      return minuteDiff + ' min';
    }

    var hourDiff = Math.floor(minuteDiff / 60);
    if(hourDiff < 24){
      return hourDiff + ' hour ';
    }

    var dayDiff = Math.floor(hourDiff / 24);
    if(dayDiff === 1){
      return 'yesterday';
    }

    if(dayDiff > 1){
      return dayDiff + 'days ago'
    }
  }
}
