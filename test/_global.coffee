a = require('chai').assert
Promise = require('bluebird')


GLOBAL.Promise = Promise
GLOBAL.a = a
GLOBAL.eq = a.deepEqual
