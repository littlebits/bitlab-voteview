/*
A module that provides a stream of votes for a bitLab project. The initial value
of the stream is the current total votes for the project. */

var getProjectVotes = require('./db').getProjectVotes
var log = require('./log').child({ component: 'vote-stream' })



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
      log.debug('project %s initial request', projectId)
      getProjectVotes(projectId)
      .then(function(votesNow) {
        log.debug('project %s first result is %s', projectId, votesNow)
        votesBefore = votesNow
        fn({
          before: null,
          after: votesNow
        })
        log.debug('project %s now being polled', projectId)
        requestInterval = setInterval(function() {
          log.trace('project %s requestInterval loop', projectId)
          getProjectVotes(projectId)
          .then(function(votesNow) {
            if (ended) return
            log.trace('project %s request result: %j', projectId, votesNow)
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
