
angular
  .module('app')
  .controller('mainCtrl', mainCtrl);

mainCtrl.$inject = ['$scope', 'postsSvc', 'notificationSvc', 'authSvc'];

function mainCtrl($scope, postsSvc, notificationSvc, authSvc){
  $scope.posts = [];
  getAllPosts();

  $scope.addNewPost = addNewPost;
  $scope.votePost = votePost;

  function getAllPosts(){
    postsSvc.getAllPosts().success(function(data){
      $scope.posts = data;
    });
  }

  function addNewPost(){
    if(!$scope.title){
      notificationSvc.error('Title required!');
      return;
    }

    var post = {
      author: authSvc.currentUser,
      title: $scope.title,
      link: $scope.link
    };

    postsSvc.createPost(post).success(function(){
      notificationSvc.success('Successfully added!');
    });
    $scope.title = '';
    $scope.link = '';
    getAllPosts();
  }

  function votePost(post){
    var upvoteInfo = {
      upvoter: authSvc.currentUser(),
      value: 1
    };
    postsSvc.upvote(post._id, upvoteInfo).success(function(data){
      post.upvotes = data.upvotes;
      notificationSvc.success('Upvoted!')
    });
  }
}
