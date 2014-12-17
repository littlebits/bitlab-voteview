db = require('../server/db')

describe 'db.js', ->
  @timeout(5000)

  describe 'getProject', ->

    it 'returns a bitLab project', ->
      db.getProject(50)
      .tap (project)->
        eq project.id, 50

    it 'returns votes for a bitLab project', ->
      db.getProjectVotes(50)
      .tap (voteCount)->
        a.isNumber voteCount
