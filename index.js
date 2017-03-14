'use strict'

require('dotenv').config({
  path: './config/.env'
})

const log = require('./lib/logger').child({ module: 'main' })
const mongo = require('./lib/mongo')
const Promise = require('bluebird')
const workerServer = require('./lib/worker')

return Promise.join(
  workerServer.start(),
  mongo.connect()
)
  .then(() => {
    log.info('all components started')
  })
  .catch((error) => {
    log.fatal({ error }, 'Clio failed to start')
    mongo.close()
    process.exit(1)
  })
