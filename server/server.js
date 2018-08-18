const log = require('pino')()
const path = require('path')
const fs = require('fs')
const http = require('http')
const https = require('https')
const helmet = require('helmet')
const express = require('express')
const socketio = require('socket.io')

let key
let cert
try {
  key = fs.readFileSync(path.join(__dirname, '../../certs/ssl.key'))
  cert =  fs.readFileSync(path.join(__dirname, '../../certs/ssl.crt'))    
} catch (err) {
  log.warn(err)
}

const credentials = {
  key,
  cert,
  checkServerIdentity: () => {
    return false
  },
  reconnect: true
}

const app = express()
app.use(helmet())

// Please note that the following block will only work if port 443 is listening or redirecting...
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect('https://' + req.headers.host + req.url)
    }
    next()
  })
}

const httpServer = http.createServer(app)
let httpsServer
try {
  httpsServer = https.createServer(credentials, app)
} catch (err) {
  log.warn(err)
}

const io = socketio()
io.attach(httpServer)
if (httpsServer) {
  io.attach(httpsServer)
}

app.use(express.static(path.join(__dirname, '../client/build')))

io.on('connection', (socket) => {
  socket.on('error', (err) => {
    console.error(err)
  })

  // socket.on('msg', (msg) => {
  //   socket.emit('msg', "Hello world")
  // })
})

app.use((req, res) => {
  res.status(404)
  log.warn('BAD REQUEST', req.method, req.url)
  res.type('txt').send('Not found')
})

app.use((err, req, res) => {
  const status = err.statusCode || err.status
  const message = err.message || 'Internal Server Error'
  // If the status is a 5XX, return the entire err object (stacktrace)
  if (String(status)[0] === '5') {
    log.error(status, err, req.method, req.url)
  } else {
    log.error(status, message, req.method, req.url)
  }
  res.status(status || 500)
  res.type('txt').send(message)
})

const httpPort = 3000
httpServer.listen(httpPort, '0.0.0.0', () => {
  log.info('HTTP server listening on port ' + httpPort)
})

const httpsPort = 3443
if (httpsServer) {
  httpsServer.listen(httpsPort, '0.0.0.0', () => {
    log.info('HTTPS server listening on port ' + httpsPort)
  })
}
