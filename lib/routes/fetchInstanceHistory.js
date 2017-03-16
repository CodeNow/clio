'use strict'

const log = require('../logger')
const mongo = require('../mongo')

module.exports = (req, res) => {
  const instanceId = req.params.instanceId
  log.trace({
    instanceId
  }, 'Fetching instance history')

  res.send(
    mongo.db.collection('instanceHistory')
      .find({
        instanceId: instanceId
      })
      .toArray()
      .tap((history) => {
        log.trace({
          historyCount: history.length
        }, 'Sent instance history')
      })
  )
}
