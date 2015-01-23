var version = require('../package').version
var data = require('./data')
var Glue = require('./glue')
var log = require('./log')



log.info('=======================')
log.info('Booting bitLab Voteview')
log.info('=======================')
log.info('version: %j', version)
log.info('-----------------------')



Glue(data.deviceProjectMappings)
