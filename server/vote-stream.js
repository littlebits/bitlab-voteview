/*
A module that provides a stream of votes for a bitLab project. The initial value
of the stream is the current total votes for the project. */

var getProjectVotes = require('./db').getProjectVotes



module.exports = function voteStream(projectId) {
  var votesBefore
  var requestInterval
  var ended = false
  return {
    end: function(){
      ended = true
      clearInterval(requestInterval)
    },
    onValue: function(fn) {
      getProjectVotes(projectId)
      .then(function(votesNow) {
        fn(votesNow)
        requestInterval = setInterval(function() {
          getProjectVotes(projectId)
          .then(function(votesNow){
            if (ended) return
            if (votesNow !== votesBefore) {
              fn(votesNow)
              votesBefore = votesNow
            }            
          })
        }, 1000)
      })
    }
  }
}
