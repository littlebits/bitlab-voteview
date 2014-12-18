var MS_PER_VOTE = 84
var MS_BETWEEN_OUTPUT = 1500

var apiOutput = require('littlebits-cloud-http').output.defaults({
  accessToken: process.env.BITLAB_VOTEVIEW_ACCESS_TOKEN,
  percent: 100,
  durationMs: MS_PER_VOTE
})

function DeviceOutput(deviceId) {
  var outputQueue = []
  var deviceOutput = apiOutput.defaults({ deviceId: deviceId })
  var consumeQueueItems = ConsumeOutputQueue(outputQueue, deviceOutput)
  return function(addedVotesCount) {
    while(addedVotesCount > 0) {
      outputQueue.push(MS_PER_VOTE)
      addedVotesCount--
    }
    consumeQueueItems()
  }
}

function ConsumeOutputQueue(queue, deviceOutput) {
  var consuming = false
  var deviceOutputInterval

  return function consume() {
    if (consuming) return
    consuming = true

    var clearLeadingInterval = setLeadingInterval(function(){
      if (queue.length) {
        queue.shift()
        deviceOutput({}, noop)
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
    setInterval(f, ms)
  }, ms)

  return function clear() {
    if (interval) clearInterval(interval)
    else {
      clearTimeout(timeout)
      interval = 'CLEARED'
    }

  }
}
