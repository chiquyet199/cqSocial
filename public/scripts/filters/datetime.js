angular
  .module('app')
  .filter('datetime', datetime);

datetime.$inject = ['$filter'];

function datetime($filter){
  return function(input){
    if(input === null){
      return '';
    }

    var now = new Date().getTime();
    var time = new Date(input).getTime();
    var secondDiff = (now - time)/1000;
    var minuteDiff = Math.floor(secondDiff % 60);
    var hourDiff = Math.floor(minuteDiff % 60);
    var dayDiff = Math.floor(hourDiff % 24);

    if(secondDiff < 60){
      return 'just now';
    }

    if(minuteDiff < 60 && minuteDiff > 1){
      return minuteDiff + ' min';
    }

    if(hourDiff < 24 && hourDiff > 1){
      return hourDiff + ' hour ';
    }

    if(dayDiff === 1){
      return 'yesterday';
    }

    if(dayDiff > 1){
      return dayDiff + 'days ago'
    }
  }
}
