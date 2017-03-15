'use strict'

require('dotenv').config({ path: './config/.env' })

const log = require('./lib/logger').child({ module: 'main' })
const mongo = require('./lib/mongo')
const workerServer = require('./lib/worker')

return mongo.connect()
  .then(workerServer.start)
  .then(() => {
    log.info('all components started')
  })
  .catch((error) => {
    log.fatal({ error }, 'Clio failed to start')
    mongo.close()
      .finally(() => {
        process.exit(1)
      })
  })
