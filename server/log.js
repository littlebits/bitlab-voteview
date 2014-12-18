var bunyan = require('bunyan')
module.exports = bunyan.createLogger({
  name: 'bitlab-voteview',
  level: (process.env.NODE_ENV === 'test' ? 'error' : 'debug')
})
