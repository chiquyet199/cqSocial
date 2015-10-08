angular
  .module('app')
  .directive('voteTooltip', voteTooltip);

voteTooltip.$inject = [];

function voteTooltip(){
  return {
    restrict: 'A',
    link: function(scope, element, attr){
      var el = $(element);
      var tooltipEl = null;
      var generateTemplate = function(){
        var votesArr = scope.postObj.votesArr;
        var tooltipTemplate = ['<div class="vote-tooltip">',
                               '<div class="vote-tooltip-inner">',
                                '<ul>'];
        var len = votesArr.length;
        scope.tmp = len;

        for(var i = 1; i < len; i++){
          tooltipTemplate.push('<li class="">'+votesArr[i].voter+'</li>');
        }

        tooltipTemplate.push('</ul></div></div>');
        tooltipTemplate = tooltipTemplate.join(' ');
        tooltipEl = $(tooltipTemplate);
        tooltipEl.insertAfter(el);

        tooltipEl.css({
          right: -tooltipEl.width() + 10
        });
      }

      generateTemplate();

      $(document).off('mouseup').on('mouseup', function (e){
        var tooltipEl = $('.vote-tooltip').filter('.active');
        var el = tooltipEl.parent('.operators').find('.badge');
        if (el.is(e.target) || el.has(e.target).length !== 0){
          return;
        }
        if (!tooltipEl.is(e.target) && tooltipEl.has(e.target).length === 0){
          tooltipEl.removeClass('active');
        }
      });

      el.click(function(){
        if(scope.postObj.votesArr.length !== scope.tmp){
          scope.tmp = scope.postObj.votesArr.length;
          tooltipEl.detach();
          generateTemplate();
        }
        tooltipEl[tooltipEl.hasClass('active') ? 'removeClass' : 'addClass']('active');
      });
    }
  }
}
