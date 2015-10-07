
angular
  .module('app')
  .factory('postsSvc', postsSvc);

postsSvc.$inject = ['$http', 'authSvc'];

function postsSvc($http, authSvc){
  return {
    getAllPosts: function(){
      return $http.get('/api/posts');
    },
    getPost: function(postId){
      return $http.get('/api/posts/' + postId);
    },
    createPost: function(post){
      return $http.post('/api/posts', post, {
        headers: {Authorization: 'Bearer '+ authSvc.getToken()}
      });
    },
    updatePost: function(postId, post){
      return $http.put('/api/posts/' + postId, post, {
        headers: {Authorization: 'Bearer '+ authSvc.getToken()}
      });
    },
    deletePost: function(postId){
      return $http.delete('/api/posts/' + postId, {
        headers: {Authorization: 'Bearer '+ authSvc.getToken()}
      });
    },
    vote: function(postId, voteInfo){
      return $http.put('/api/posts/' + postId + '/vote', voteInfo, {
        headers: {Authorization: 'Bearer '+ authSvc.getToken()}
      });
    },
    getAllComments: function(postId){
      return $http.get('/api/posts/' + postId + '/comments');
    },
    createComment: function(postId, comment){
      return $http.post('/api/posts/' + postId + '/comments', comment, {
        headers: {Authorization: 'Bearer '+ authSvc.getToken()}
      });
    },
    getComment: function(postId, commentId){
      return $http.post('/api/posts/' + postId + '/comments' + commentId);
    }
  };
}
