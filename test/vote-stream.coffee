VoteStream = require('../server/vote-stream')



describe 'voteStream', ->



  it 'returns the initial voteCount', (done)->
    data = id: 1, vote_count: 10
    mock = mockAPIBits(data: id:1, vote_count:10)

    voteStream = VoteStream(1).onValue (voteCount)->
      voteStream.end()
      voteCount is 10
      mock.isDone()
      done()


  it 'Polls for new votes, onValue when when voteCount changes', (done)->
    @timeout(50000)
    nock 'https://littlebits.cc/bitlab/bits'
    .get "/1.json"
    .times 2
    .reply 200, id: 1, vote_count: 10
    .get "/1.json"
    .reply 200, id: 1, vote_count: 11
    expectedValues = [
      { before: null, after: 10 }
      { before: 10, after: 11 }
    ]
    i = 0

    voteStream = VoteStream(1).onValue (voteCount)->
      if i is (expectedValues.length - 1)
        voteStream.end()
        done()
      eq voteCount, expectedValues[i]
      i++
