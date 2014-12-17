a = require('chai').assert
Promise = require('bluebird')


GLOBAL.nock = require('nock')
GLOBAL.Promise = Promise
GLOBAL.a = a
GLOBAL.eq = a.deepEqual

GLOBAL.mockAPIBits = (config)->
  nock('https://littlebits.cc')
  .get "/bitlab/bits/#{config.data.id}.json"
  .times(config.times or 1)
  .reply 200, config.data
