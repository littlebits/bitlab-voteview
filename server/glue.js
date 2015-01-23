var VoteStream = require('./vote-stream')
var VoteSignaler = require('./vote-signaler')
var log = require('./log').child({ component: 'glue' })



module.exports = function glue(deviceProjectMappings) {

  var links = deviceProjectMappings.map(function(mapping) {
    var signalVote = VoteSignaler(mapping.deviceId)
    var stream = VoteStream(mapping.projectId).onValue(function(votes) {
      /* Ignore the initial result which just tells us the current total votes.*/
      if (votes.before === null) return

      var addedVotesCount = votes.after - votes.before
      log.debug('%d new vote(s) for project %s to device %s', addedVotesCount, mapping.projectId, mapping.deviceId)
      signalVote(addedVotesCount)
    })

    return {
      voteOutputQueue: signalVote.queue,
      voteStream: stream
    }
  })

  return {
    links: links,
    end: function() {
      links.forEach(function(link) {
        link.voteStream.end()
      })
    }
  }
}
