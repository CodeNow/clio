'use strict'

const log = require('../logger')
const mongo = require('../mongo')

module.exports = (req) => {
  const instanceId = req.params.instanceId
  log.trace({
    instanceId
  }, 'Fetching instance history')

  return mongo.db.collection('instanceHistory')
    .find({
      instanceId: instanceId
    })
    .sort({_id: 1})
    .limit(100)
    .toArray()
    .tap((history) => {
      log.trace({
        historyCount: history.length
      }, 'Sent instance history')
    })
}
