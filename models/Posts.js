var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  author: String,
  upvotes: { type: Number, default: 0},
  upvotesArr: { type: Array, default: [{ upvoter: 'xxx', value: 0 }]},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

PostSchema.methods.upvote = function(upvoteInfo, cb){
  var self = this;

  for(var i = 0; i < self.upvotesArr.length; i++){
    if(self.upvotesArr[i].upvoter === upvoteInfo.upvoter){
      self.upvotesArr.splice(i,1);
      self.upvotes = self.upvotesArr.length - 1;
      self.save(cb);
      return;
    }
  }

  self.upvotesArr.push(upvoteInfo);
  self.upvotes = self.upvotesArr.length - 1;
  self.save(cb);
};

mongoose.model('Post', PostSchema);
