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



exports.getProjectVotes = function(projectId) {

  var requestConfig = {
    method: 'get',
    json: true,
    uri: apiHost + '/' + projectId + '.json',
    auth: apiAuth
  }

  return request(requestConfig)
  .get(0)
  .get('body')
}
