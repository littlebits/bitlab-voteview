Glue = require('../server/glue')



describe 'Glue', ->

  it 'creates polling streams that take from bitLab API and send to device API', (done)->

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


    glue = undefined
    setTimeout (->
      glue = Glue([{ deviceId:1, projectId:2 }])
    ), 10

    setTimeout (-> glue.end()), 350
    setTimeout (->
      deviceAPI.done()
      done()
    ), 1000
