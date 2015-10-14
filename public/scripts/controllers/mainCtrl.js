
(function(){
  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', 'postsSvc', 'notificationSvc', 'authSvc', 'socketIO', '$timeout', '$window'];

  function MainCtrl($scope, postsSvc, notificationSvc, authSvc, socketIO, $timeout, $window){
    $scope.posts = [];
    $scope.childData = {};

    $scope.$on('gotUsers', function(data){
      getAllPosts();
    });

    $scope.$on('haveNewFriend', function(){
      getAllPosts();
    });

    socketIO.emit('join', {id: authSvc.currentUser()._id});

    socketIO.on('newPostCreated', function(post){
      var author = post.author;
      var scopeUser = $scope.childData.users.filter(function(user){
        return user.username === authSvc.currentUser().username;
      })[0];
      if(scopeUser.friends.map(function(f){ return f.username; }).indexOf(author) >= 0){
        $scope.posts.push(post);
      }
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
      if(data.post.author === authSvc.currentUser().username && data.voteInfo.voter !== data.post.author){
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
      if(data.post.author === authSvc.currentUser().username && data.cmt.author !== data.post.author){
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
        $scope.posts = getPosts(data);
      });
    }

    function getPosts(posts){
      var username = authSvc.currentUser().username;
      var currentUser = $scope.childData.users.filter(function(user){
        return user.username === username;
      });

      var myPosts = posts.filter(function(post){
        return post.author === username;
      });

      console.log(myPosts + ' ' + myPosts.length);

      var friendPosts = posts.filter(function(post){
        return currentUser[0].friends.map(function(x){return x.username}).indexOf(post.author) >= 0;
      });

      return myPosts.concat(friendPosts);
    }

    function addNewPost(){
      if(!$scope.title){
        notificationSvc.error('Title required!');
        return;
      }

      var post = {
        author: authSvc.currentUser().username,
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
})();
