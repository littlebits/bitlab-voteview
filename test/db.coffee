db = require('../server/db')



describe 'db.js', ->
  @timeout(5000)

  describe 'getProject', ->

    it 'returns a bitLab project', ->
      mock = mockAPIBits(data: id:1)
      db.getProject(1)
      .tap (project)->
        eq project.id, 1

    it 'returns votes for a bitLab project', ->
      mock = mockAPIBits(data: id:1, vote_count: 10)
      db.getProjectVotes(1)
      .tap (voteCount)->
        eq voteCount, 10
