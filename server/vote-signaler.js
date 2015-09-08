var FS = require('fs')
var outputConfig = require('./data').output
var log = require('./log').child({ component: 'device-output-votes' })
var setImmediateInterval = require('./set-immediate-interval')



var accessToken = FS.readFileSync(
  '/etc/secrets/bitlab-voteview-access-token',
  { encoding: 'utf8' }
)

var apiOutput = require('littlebits-cloud-http').output.defaults({
  access_token: accessToken,
  percent: outputConfig.percent,
  duration_ms: outputConfig.msPerVote
})



module.exports = function VoteSignaler(deviceId) {
  var queue = []
  var deviceOutput = apiOutput.defaults({ device_id: deviceId })
  var consumeQueueItems = ConsumeOutputQueue(queue, deviceOutput)

  function addVotes(addedVotesCount) {
    while(addedVotesCount > 0) {
      queue.push(outputConfig.msPerVote)
      addedVotesCount--
    }
    consumeQueueItems()
  }

  addVotes.queue = queue

  return addVotes
}



/* Private */

function ConsumeOutputQueue(queue, deviceOutput) {
  var consuming = false
  var outputConfig = deviceOutput.defaults()

  return function consume() {
    if (consuming) return
    consuming = true

    var clearImmediateInterval = setImmediateInterval(function() {
      if (queue.length) {
        queue.shift()
        log.info('About to send output to device %s.', outputConfig.device_id)
        deviceOutput(function(err) {
          if (err) return log.error(err, 'Failed to send output to device %j.', outputConfig.device_id)
          log.info('Successfully sent output to device %j.', outputConfig.device_id)
        })
      } else {
        consuming = false
        clearImmediateInterval()
      }
    }, outputConfig.msBetweenOutput)
  }
}
