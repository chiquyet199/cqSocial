
angular
  .module('app')
  .controller('mainCtrl', mainCtrl);

mainCtrl.$inject = ['$scope', 'postsSvc', 'notificationSvc', 'authSvc', 'socketIO', '$timeout'];

function mainCtrl($scope, postsSvc, notificationSvc, authSvc, socketIO, $timeout){
  $scope.posts = [];
  getAllPosts();

  socketIO.on('newPostCreated', function(post){
    $scope.posts.push(post);
  });

  socketIO.on('postDeleted', function(postId){
    // var deletedPost = $scope.posts.filter(function(item){
    //   return item._id === postId;
    // });
    var length = $scope.posts.length;
    for(var i = 0; i < length; i++){
      if($scope.posts[i]._id === postId){
        console.log('remove post on socket');
        $scope.posts.splice(i,1);
        return;
      }
    }
  });

  $scope.addNewPost = addNewPost;

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
