'use strict'

const log = require('../logger')
const mongo = require('../mongo')
const Boom = require('boom')

module.exports = (req) => {
  const containerId = req.params.containerId
  log.trace({
    containerId
  }, 'Fetching container instance')

  return mongo.db.collection('instanceHistory')
    .findOne({
      $or: [
        {
          'build.containerId': containerId
        },
        {
          'application.containerId': containerId
        }
      ]
    })
    .then((record) => {
      log.trace({
        record
      }, 'Record fetch results')
      if (!record) {
        throw Boom.notFound('No instance found for containerId')
      }
      return record.instanceId
    })
}
