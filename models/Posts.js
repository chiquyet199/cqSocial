var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  author: String,
  time: {type: Number, default: 0},
  votes: { type: Number, default: 0},
  votesArr: { type: Array, default: [{ voter: 'xxx', value: 0 }]},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

PostSchema.methods.vote = function(voteInfo, cb){
  var self = this;

  for(var i = 0; i < self.votesArr.length; i++){
    if(self.votesArr[i].voter === voteInfo.voter){
      self.votesArr.splice(i,1);
      self.votes = self.votesArr.length - 1;
      self.save(cb);
      return;
    }
  }

  self.votesArr.push(voteInfo);
  self.votes = self.votesArr.length - 1;
  self.save(cb);
};

mongoose.model('Post', PostSchema);
