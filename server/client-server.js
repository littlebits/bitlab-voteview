/* This server is for the client app that will allow end-users to manage an
installation of the bitLab VoteView. */

var koa = require('koa')



var app = koa()

app.use(function *() {
  this.body = 'This is the future home of the bitLab Voteview Console!'
})

app.listen(process.env.PORT || 80)
