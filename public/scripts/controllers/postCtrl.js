angular
  .module('app')
  .controller('postCtrl', postCtrl);

postCtrl.$inject = ['$scope', 'postsSvc', 'authSvc', 'notificationSvc', 'socketIO'];

function postCtrl($scope, postsSvc, authSvc, notificationSvc, socketIO){
  $scope.editMode = false;
  $scope.voteMode = getVoteMode(authSvc.currentUser());

  $scope.editPost = editPost;
  $scope.votePost = votePost;
  $scope.deletePost = deletePost;
  $scope.getVoteMode = getVoteMode;
  $scope.postComment = postComment;
  $scope.keyUpOnEdit = keyUpOnEdit;
  $scope.isUserAuthPost = isUserAuthPost;
  $scope.toggleEditModeFunc = toggleEditModeFunc;
  $scope.getAllCommentsInPost = getAllCommentsInPost;

  getAllCommentsInPost($scope.postObj._id);

  function getVoteMode(currentUser){
    var votesArr = $scope.postObj.votesArr;
    for(var i = 0; i < votesArr.length; i++){
      if(votesArr[i].voter === currentUser){
        return false;
      }
    }
    return true;
  }

  function postComment(post){
    if(!$scope.commentBody){
      return;
    }
    var comment = {
      body: $scope.commentBody
    };
    postsSvc.createComment(post._id, comment).success(function(data){
      post.comments.push(data.cmt);
      socketIO.emit('postCmt', data);
    });
    $scope.commentBody = '';
  };

  function getAllCommentsInPost(postId){
    postsSvc.getAllComments(postId).success(function(data){
      $scope.postObj.comments = data;
    });
  }

  function isUserAuthPost(){
    return $scope.postObj.author === authSvc.currentUser();
  }

  function toggleEditModeFunc(){
    $scope.editMode = !$scope.editMode;
    if($scope.editMode){
      $scope.postBeforeEdit = $scope.postObj.title;
    }
  }

  function editPost(post){
    postsSvc.updatePost(post._id, post).error(function(err){
      notificationSvc.error('Open console to see full error!')
      console.log('error:', err);
    }).success(function(){
      toggleEditModeFunc();
      notificationSvc.success('Update successful!')
    });
  }

  function keyUpOnEdit(e){
    if(e.keyCode === 27){
      $scope.postObj.title = $scope.postBeforeEdit;
      toggleEditModeFunc();
    }
  }

  function deletePost(post){
    postsSvc.deletePost(post._id).error(function(err){
      notificationSvc.error(err.message);
    }).success(function(){
      notificationSvc.success('Successfully deleted!');
      var length = $scope.$parent.posts.length;
      for(var i = 0; i < length; i++){
        if($scope.$parent.posts[i]._id === post._id){
          $scope.$parent.posts.splice(i,1);
          return;
        }
      }
    });
  }

  function votePost(post){
    var voteInfo = {
      voter: authSvc.currentUser(),
      value: 1
    };
    postsSvc.vote(post._id, voteInfo).success(function(data){
      $scope.postObj.votes = data.votes;
      $scope.postObj.votesArr = data.votesArr;
      $scope.voteMode = getVoteMode(authSvc.currentUser());
      // notificationSvc.success('voted!')
    });
  }
}
