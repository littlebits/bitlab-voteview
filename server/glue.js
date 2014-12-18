

var VoteStream = require('./vote-stream')



module.exports = function glue(deviceProjectMappings) {

  var queues = {}

  var streams = deviceProjectMappings.map(function(mapping) {
    queues[mapping.deviceId] = []
    return VoteStream(mapping.projectId).onValue(function(votes) {
      /* Ignore the initial result which just tells us the current total votes.*/
      if (votes.before === null) {
        // console.log('Begin polling project %s which currently has %d votes.', mapping.projectId, votes.after)
        return
      }

      var diff = votes.after - votes.before
      // console.log('%d new vote(s) for project %s to device %s', diff, mapping.projectId, mapping.deviceId)
      queues[mapping.deviceId].push(diff)
    })
  })

  return {
    queues: queues,
    end: function() {
      streams.forEach(function(stream) {
        stream.end()
      })
    }
  }
}
