'use strict'

const log = require('./logger').child({ module: 'worker-server' })
const ponos = require('ponos')

const events = {
  'instance.updated': require('./workers/instance.updated.js')
}
const tasks = {}

module.exports = new ponos.Server({
  name: process.env.APP_NAME,
  enableErrorEvents: true,
  rabbitmq: {
    channel: {
      prefetch: process.env.CLIO_PREFETCH
    }
  },
  log: log,
  tasks: tasks,
  events: events
})
