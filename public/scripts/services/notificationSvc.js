
angular
  .module('app')
  .factory('notificationSvc', notificationSvc);

notificationSvc.$inject = ['toastr'];

function notificationSvc(toastr){
  return {
    success: function(text){
      toastr.success(text, 'success');
    },
    error: function(text){
      toastr.error(text, 'error');
    }
  };
}
