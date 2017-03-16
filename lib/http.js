'use strict'

const log = require('./logger')
const express = require('express')
const Promise = require('bluebird')

// Define routes here so they load on app load and not on server startup
const routes = {
  fetchInstanceHistory: require('./routes/fetchInstanceHistory')
}

class Server {
  constructor () {
    this.app = this.createApp()
  }

  createApp () {
    const app = express()
    app.use(require('express-promise')())

    app.get('/instances/:instanceId/history', routes.fetchInstanceHistory)

    return app
  }

  start () {
    return Promise.fromCallback((cb) => {
      this.app.listen(process.env.PORT, cb)
    })
      .tap(() => {
        log.trace('HTTP Server Started')
      })
  }
}

module.exports = new Server()
