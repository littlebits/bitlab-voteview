var path = require('path')
var yaml = require('js-yaml')
var fs = require('fs')
var data = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'data.yaml'), 'utf8'))
var Glue = require('./glue')



Glue(data.deviceProjectMappings)
