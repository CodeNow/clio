'use strict'

const Promise = require('bluebird')
const logger = require('../logger')
const joi = require('joi')

module.exports.jobSchema = exports.instanceChange = joi.object({
  instance: joi.object({
    owner: joi.object({
      github: joi.number().required()
    }).unknown().required(),
    contextVersion: joi.object({
      appCodeVersions: joi.array().items(
        joi.object({
          repo: joi.string().required(),
          branch: joi.string().required()
        }).unknown().label('app code version')
      ).required()
    }).unknown().required().label('context version')
  }).unknown().required()
}).unknown().required()

module.exports.task = (job) => {
  const log = logger.child({
    module: 'InstanceUpdated',
    data: job
  })
  log.trace('called')
  return Promise.resolve({})
}
