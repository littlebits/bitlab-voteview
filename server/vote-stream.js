/*
A module that provides a stream of votes for a bitLab project. The initial value
of the stream is the current total votes for the project. */

var getProjectVotes = require('./db').getProjectVotes



module.exports = function voteStream(projectId) {
  var votesBefore
  var requestInterval
  var ended = false
  var api = {
    end: function() {
      ended = true
      clearInterval(requestInterval)
      return api
    },
    onValue: function(fn) {
      getProjectVotes(projectId)
      .then(function(votesNow) {
        votesBefore = votesNow
        fn({
          before: null,
          after: votesNow
        })
        requestInterval = setInterval(function() {
          // console.log('requestInterval loop')
          getProjectVotes(projectId)
          .then(function(votesNow) {
            if (ended) return
            // console.log('request result: %j', votesNow)
            if (votesBefore !== votesNow) {
              fn({
                before: votesBefore,
                after: votesNow
              })
              votesBefore = votesNow
            }
          })
        }, 2000)
      })
      return api
    }
  }

  return api
}
