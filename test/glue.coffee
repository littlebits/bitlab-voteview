Glue = require('../server/glue')



describe 'Glue', ->

  it 'creates polling streams that take from bitLab API and send to device API', (done)->
    @timeout(12000)

    bitlabAPI = nock 'https://littlebits.cc/bitlab/bits'
    .get '/2.json'
    .reply 200, { vote_count: 500 }
    .get '/2.json'
    .reply 200, { vote_count: 501 }
    .get '/2.json'
    .reply 200, { vote_count: 502 }

    deviceAPI = nock "https://api-http.littlebitscloud.cc/devices/1"
    .post('/output', { duration_ms: 84, percent: 100 })
    .reply(200)
    .post('/output', { duration_ms: 84, percent: 100 })
    .reply(200)

    glue = Glue([{ deviceId:1, projectId:2 }])

    setTimeout (-> glue.end()), 6000
    setTimeout (->
      deviceAPI.done()
      done()
    ), 10000
