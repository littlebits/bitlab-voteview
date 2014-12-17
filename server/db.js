var Promise = require('bluebird')
var request = Promise.promisify(require('request'))



/* Gather API details. These have defaults but can be overrided via
ENV vars which is useful for working with non-production servers etc. */

var apiHost = process.env.BITLAB_VOTEVIEW_HOST || 'http://littlebits.cc/bitlab/bits'

/* Support APIs behind HTTP Basic Auth. This is mainly a feature to support
the fact that littleBits puts stg servers behind Basic Auth and this project
is currently being developed against such a staging server. */

var authUser = process.env.BITLAB_VOTEVIEW_AUTH_USER
var authPass = process.env.BITLAB_VOTEVIEW_AUTH_PASS
var apiAuth = authUser && authPass
  ? {
      user: authUser,
      pass: authPass,
      sendImmediately: false
    }
  : null



/*
getProject :: projectId:Int -> Promise Project:Object
*/
exports.getProject = function(projectId) {

  var requestConfig = {
    method: 'get',
    json: true,
    uri: apiHost + '/' + projectId + '.json',
    auth: apiAuth
  }

  return request(requestConfig)
  .get(0)
  .catch(is500, createError500)
  .get('body')
}



/*
getProjectVotes :: projectId:Int -> Promise votes:Int
*/
exports.getProjectVotes = function(projectId) {
  return exports
    .getProject(projectId)
    .get('vote_count')
}



// Helpers

function is500(res) {
  return res.statusCode === 500
}

function createError500(res) {
  throw new Error(
    res.body && res.body.error && res.body.error.message
    ? res.body.error.message
    : 'Unknown bitLab Server error.'
  )
}
