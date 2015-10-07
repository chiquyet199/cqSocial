var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

function init(io){
  router.route('/')

    .post(auth, function(req, res, next){
      var post = new Post();
      post.author = req.payload.username || 'Anonymous';
      post.title = req.body.title || post.title;
      post.link = req.body.link || post.link;
      post.time = new Date().getTime();

      post.save(function(err, post){
        if(err){ return next(err); }
        io.emit('newPostCreated', post);
        res.json(post);
      });
    })

    .get(function(req, res, next){
      Post.find(function(err, posts){
        if(err){ return next(err); }
        res.json(posts);
      });
    });

  router.param('post_id', function(req, res, next, id){
    var query = Post.findById(id);

    query.exec(function(err, post){
      if(err){ return next(err); };
      if(!post){ return next(new Error('Can not find post!')); }
      req.post = post;
      return next();
    });
  });

  router.route('/:post_id')

    .get(function(req, res){
        res.json(req.post);
    })

    .put(auth, function(req, res, next){
      if(req.post.author !== req.payload.username){
        return res.status(401).json({message: 'You are not allow to edit others post!'});
      }

      var post = req.post;
      post.title = req.body.title || post.title;
      post.link = req.body.link || post.link;
      post.save(function(err){
        if(err){ return next(err); }
        io.emit('postEdited', post);
        res.json({ message: 'Data has updated succesfully!'});
      });
    })

    .delete(auth, function(req, res, next){
      if(req.post.author !== req.payload.username){
        return res.status(401).json({message: 'You are not allow to delete others post!'});
      }

      Comment.remove({post: req.params.post_id});
      Post.remove({
        _id: req.params.post_id
      }, function(err, post){
        if(err){ return next(err); }
        io.emit('postDeleted', req.params.post_id);
        res.json({ message: 'Succesfully deleted!'})  ;
      });
    });

  router.route('/:post_id/vote')

    .put(auth, function(req, res, next){
      var voteInfo = req.body;
      req.post.vote(voteInfo, function(err, post){
        if(err){ return next(err)};
        io.emit('postVoted', post);
        res.json(post);
      });
    });

  router.route('/:post_id/comments')

    .get(function(req, res, next){
      Comment.find(function(err, comments){
        if(err){ return next(err); }
        var commentsInPost = comments.filter(function(item){
          return item.post == req.params.post_id;
        });
        res.json(commentsInPost);
      });
    })

    .post(auth, function(req, res, next){
      var comment = new Comment(req.body);
      comment.post = req.post;
      comment.author = req.payload.username;
      comment.time = new Date().getTime();

      comment.save(function(err, comment){
        req.post.comments.push(comment);
        req.post.save(function(err, post){
          if(err){ return next(err); }
          var data = {
            post: req.post,
            cmt: comment
          };
          // io.emit('postCommented', data);
          res.json(data);
        });
      });
    });

  router.route('/:post_id/comments/:comment_id')

    .get(function(req, res, next){
      Comment.findById(req.params.comment_id, function(err, comment){
        if(err){ return next(err); }
        res.json(comment);
      });
    });

  return router;
}

module.exports = init;




