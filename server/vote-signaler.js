var outputConfig = require('./data').output
var log = require('./log').child({ component: 'device-output-votes' })



var apiOutput = require('littlebits-cloud-http').output.defaults({
  access_token: process.env.BITLAB_VOTEVIEW_ACCESS_TOKEN,
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
  var deviceOutputInterval

  return function consume() {
    if (consuming) return
    consuming = true

    var clearLeadingInterval = setLeadingInterval(function() {
      if (queue.length) {
        queue.shift()
        log.info('About to send output to device.')
        deviceOutput(function(err) {
          if (err) return log.error(err, 'Failed to send output to device.')
          log.info('Successfully sent output to device.')
        })
      } else {
        consuming = false
        clearLeadingInterval()
      }
    }, outputConfig.msBetweenOutput)
  }
}

function noop() {}

function setLeadingInterval(f, ms) {
  setImmediate(f)

  var interval
  var timeout = setTimeout(function() {
    if (interval === 'CLEARED') return
    interval = setInterval(f, ms)
  }, ms)

  return function clearLeadingInterval() {
    if (interval) clearInterval(interval)
    else {
      clearTimeout(timeout)
      interval = 'CLEARED'
    }

  }
}
