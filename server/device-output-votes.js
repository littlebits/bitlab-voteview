var log = require('./log').child({ component: 'device-output-votes' })

var MS_PER_VOTE = 84
var MS_BETWEEN_OUTPUT = 1500

var apiOutput = require('littlebits-cloud-http').output.defaults({
  access_token: process.env.BITLAB_VOTEVIEW_ACCESS_TOKEN,
  percent: 100,
  duration_ms: MS_PER_VOTE
})



module.exports = function DeviceOutputm(deviceId) {
  var queue = []
  var deviceOutput = apiOutput.defaults({ device_id: deviceId })
  var consumeQueueItems = ConsumeOutputQueue(queue, deviceOutput)

  function addVotes(addedVotesCount) {
    while(addedVotesCount > 0) {
      queue.push(MS_PER_VOTE)
      addedVotesCount--
    }
    consumeQueueItems()
  }

  addVotes.queue = queue

  return addVotes
}

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
    }, MS_BETWEEN_OUTPUT)
  }
}



// Helpers

function noop(){}

function setLeadingInterval(f, ms) {
  f()

  var interval
  var timeout = setTimeout(function(){
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
