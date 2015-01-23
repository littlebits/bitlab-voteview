/*
A module that provides a stream of votes for a bitLab project. The initial value
of the stream is the current total votes for the project. */

var setImmediateInterval = require('./set-immediate-interval')
var getProjectVotes = require('./db').getProjectVotes
var log = require('./log').child({ component: 'vote-stream' })
var DB_POLL_INTERVAL_MS = Number(process.env.BITLAB_VOTEVIEW_DB_POLL_INTERVAL_MS) || 2000



module.exports = function voteStream(projectId) {
  var votesBefore
  var clearRequestInterval
  var ended = false
  var api = {
    end: function() {
      ended = true
      clearRequestInterval()
      clearRequestInerval = null
      return api
    },
    onValue: function(fn) {
      if (clearRequestInterval) throw new Error('Stream already has an onValue handler')
      log.debug('project %s now being polled', projectId)

      var votesBefore = null

      clearRequestInterval = setImmediateInterval(function() {
        getProjectVotes(projectId)
        .then(function(votesNow) {
          log.trace('project %s request result: %j', projectId, votesNow)

          if (votesBefore !== votesNow) {
            fn({
              before: votesBefore,
              after: votesNow
            })
          }

          votesBefore = votesNow
        })
        .catch(function(err) {
          log.error(err, 'Could not get votes for project %j', projectId)
        })
      }, DB_POLL_INTERVAL_MS)

      return api
    }
  }

  return api
}
