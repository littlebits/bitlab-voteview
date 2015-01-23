module.exports = setImmediateInterval



function setImmediateInterval(f, ms) {
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
