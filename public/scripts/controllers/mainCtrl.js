
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

  socketIO.on('postVoted', function(data){
    var length = $scope.posts.length;
    var postId = data.post._id;
    if(data.post.author === authSvc.currentUser() && data.voteInfo.voter !== data.post.author){
      mes = ((data.voteInfo.gap > 0) ? (data.voteInfo.voter + ' like') : (data.voteInfo.voter + ' unlike')) + ' your post';
      notificationSvc.info(mes);
    }
    for(var i = 0; i < length; i++){
      if($scope.posts[i]._id === postId){
        $scope.posts[i].votes = data.post.votes;
        return;
      }
    }
  });

  socketIO.on('postCommented', function(data){
    var length = $scope.posts.length;
    var postId = data.post._id;
    var timeCmt = data.cmt.time;
    var newCmt = data.cmt;
    if(data.post.author === authSvc.currentUser() && data.cmt.author !== data.post.author){
      mes = data.cmt.author + ' comment on your post';
      notificationSvc.info(mes);
    }
    for(var i = 0; i < length; i++){
      if($scope.posts[i]._id === postId){
        $scope.posts[i].comments.push(newCmt);
        return;
      }
    }
  });

  socketIO.on('postEdited', function(post){
    var length = $scope.posts.length;
    var postId = post._id;
    for(var i = 0; i < length; i++){
      if($scope.posts[i]._id === postId){
        $scope.posts[i].title = post.title;
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
      notificationSvc.success('Successfully added!');
    });
    $scope.title = '';
    $scope.link = '';
    getAllPosts();
  }
}
