(function(){
  angular
    .module('app')
    .factory('notificationSvc', notificationSvc);

  notificationSvc.$inject = ['toastr'];

  function notificationSvc(toastr){
    return {
      info: function(text){
        toastr.info(text);
      },
      success: function(text){
        toastr.success(text, 'success');
      },
      error: function(text){
        toastr.error(text, 'error');
      }
    };
  }
})();
