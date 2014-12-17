VoteStream = require('../server/vote-stream')



describe 'voteStream', ->



  it 'returns the initial voteCount', (done)->
    voteStream = VoteStream(1)
    data = id: 1, vote_count: 10
    mock = mockAPIBits(data: id:1, vote_count:10)

    voteStream.onValue (voteCount)->
      voteStream.end()
      voteCount is 10
      mock.isDone()
      done()


  it.skip 'Polls the API for new votes, only triggering onValue when when voteCount has changed', (done)->
    @timeout(20000)
    voteStream = VoteStream(1)
    data = id: 1, vote_count: 10
    mock1 = mockAPIBits(data: id:1, vote_count:10)
    expectedValues = [10, 11]
    i = 0

    voteStream.onValue (voteCount)->
      if i is expectedValues.length
        voteStream.end()
        done()
      voteCount is expectedValues[i]
      mock2 = mockAPIBits(data: id:1, vote_count:11)
      i++
