
angular
  .module('app')
  .directive('post', post);

function post(){
  return {
    restrict: 'E',
    templateUrl: './views/partial/post.html',
    replace: true,
    scope: {
      postObj: '=',
      voteFunc: '&'
    },
    controller: function($scope, postsSvc, authSvc, notificationSvc, socketIO){
      $scope.editMode = false;
      $scope.voteMode = getVoteMode(authSvc.currentUser());

      $scope.editPost = editPost;
      $scope.votePost = votePost;
      $scope.deletePost = deletePost;
      $scope.getVoteMode = getVoteMode;
      $scope.postComment = postComment;
      $scope.isUserAuthPost = isUserAuthPost;
      $scope.toggleEditModeFunc = toggleEditModeFunc;
      $scope.getAllCommentsInPost = getAllCommentsInPost;

      getAllCommentsInPost($scope.postObj._id);

      function getVoteMode(currentUser){
        var upvotesArr = $scope.postObj.upvotesArr;
        for(var i = 0; i < upvotesArr.length; i++){
          if(upvotesArr[i].upvoter === currentUser){
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
          post.comments.push(data);
          socketIO.emit('postCmt');
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

      function deletePost(post){
        postsSvc.deletePost(post._id).error(function(err){
          notificationSvc.error(err.message);
        }).success(function(){
          notificationSvc.success('Successfully deleted!');
          // var p = $scope.$parent.posts.filter(function(item){
          //   return item._id === post._id;
          // });
          // $scope.$parent.posts.pop(p);
          var length = $scope.$parent.posts.length;
          for(var i = 0; i < length; i++){
            if($scope.$parent.posts[i]._id === postId){
              console.log('remove post on socket');
              $scope.$parent.posts.splice(i,1);
              return;
            }
          }
        });
      }

      function votePost(post){
        var upvoteInfo = {
          upvoter: authSvc.currentUser(),
          value: 1
        };
        postsSvc.upvote(post._id, upvoteInfo).success(function(data){
          $scope.postObj = data;
          $scope.voteMode = getVoteMode(authSvc.currentUser());
          socketIO.emit('postVoted');
          // notificationSvc.success('voted!')
        });
      }
    },
    link: function(scope, element, attrs){
      var commentEl = angular.element(element[0].getElementsByClassName('comment'));
      var commentBtn = angular.element(element[0].getElementsByClassName('glyphicon-comment'));

      commentBtn.on('click', function(){
        commentEl.toggleClass('active');
      });
    }
  }
}
