var path = require('path')
var yaml = require('js-yaml')
var fs = require('fs')



module.exports = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'data.yaml'), 'utf8'))
