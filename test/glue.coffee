Glue = require('../server/glue')



describe 'Glue', ->

  it 'creates polling streams that push to deviceId queues', (done)->
    @timeout(10000)
    nock 'https://littlebits.cc/bitlab/bits'
    .get '/2.json'
    .reply 200, { vote_count: 500 }
    .get '/2.json'
    .reply 200, { vote_count: 501 }
    .get '/2.json'
    .reply 200, { vote_count: 600 }

    glue = Glue([{ deviceId:1, projectId:2 }])
    setTimeout (->
      eq glue.queues['1'], [1, 99]
      glue.end()
      done()
    ), 6000
