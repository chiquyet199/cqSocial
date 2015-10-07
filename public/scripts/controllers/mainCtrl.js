
angular
  .module('app')
  .controller('mainCtrl', mainCtrl);

mainCtrl.$inject = ['$scope', 'postsSvc', 'notificationSvc', 'authSvc', 'socketIO', '$timeout', '$window'];

function mainCtrl($scope, postsSvc, notificationSvc, authSvc, socketIO, $timeout, $window){
  $scope.posts = [];
  getAllPosts();

  socketIO.on('newPostCreated', function(post){
    $scope.posts.push(post);
  });

  socketIO.on('postDeleted', function(postId){
    var length = $scope.posts.length;
    for(var i = 0; i < length; i++){
      if($scope.posts[i]._id === postId){
        $scope.posts.splice(i,1);
        return;
      }
    }
  });

  socketIO.on('postVoted', function(post){
    var length = $scope.posts.length;
    var postId = post._id;
    for(var i = 0; i < length; i++){
      if($scope.posts[i]._id === postId){
        $scope.posts[i].votes = post.votes;
        return;
      }
    }
  });

  socketIO.on('postCommented', function(data){
    var length = $scope.posts.length;
    var postId = data.post._id;
    var timeCmt = data.cmt.time;
    var newCmt = data.cmt;
    for(var i = 0; i < length; i++){
      if($scope.posts[i]._id === postId){
        $scope.posts[i].comments.push(newCmt);
        return;
      }
    }
  });

  $scope.addNewPost = addNewPost;

  function getAllPosts(){
    postsSvc.getAllPosts().success(function(data){
      $scope.posts = data;
      $window.posts = data;
    });
  }

  function addNewPost(){
    if(!$scope.title){
      notificationSvc.error('Title required!');
      return;
    }

    var post = {
      author: authSvc.currentUser(),
      title: $scope.title,
      link: $scope.link
    };

    postsSvc.createPost(post).success(function(){
      socketIO.emit('postCreated', post);
      notificationSvc.success('Successfully added!');
    });
    $scope.title = '';
    $scope.link = '';
    getAllPosts();
  }
}
