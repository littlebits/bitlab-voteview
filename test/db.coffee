db = require('../server/db')

describe 'db.js', ->

  describe 'getProjectVotes', ->

    it 'returns current total votes for a project', ->
      db.getProjectVotes(50)
      .tap (project)->
        eq project.id, 50
