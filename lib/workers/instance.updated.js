'use strict'

const _ = require('lodash')
const joi = require('joi')
const logger = require('../logger')
const mongo = require('../mongo')
const WorkerStopError = require('error-cat/errors/worker-stop-error')
const Promise = require('bluebird')

module.exports.jobSchema = exports.instanceChange = joi.object({
  instance: joi.object({
    owner: joi.object({
      github: joi.number().required(),
      username: joi.string().required()
    }).unknown().required(),
    containers: joi.array().items(
      joi.object({
        dockerContainer: joi.string(),
        inspect: joi.object({
          State: joi.object({
            ExitCode: joi.number(),
            StartedAt: joi.string(),
            FinishedAt: joi.string()
          }).unknown().label('container inspect state')
        }).unknown().label('container inspect')
      }).unknown().label('containers')
    ),
    contextVersion: joi.object({
      build: joi.object().unknown().required(),
      appCodeVersions: joi.array().items(
        joi.object({
          repo: joi.string().required(),
          branch: joi.string().required(),
          commit: joi.string().required()
        }).unknown().label('app code version')
      ).required()
    }).unknown().required().label('context version')
  }).unknown().required()
}).unknown().required()

module.exports.task = Promise.method((job) => {
  const log = logger.child({
    module: 'InstanceUpdated',
    data: job
  })
  log.trace('called')

  if (!_.has(job, 'instance.contextVersion.appCodeVersions')) {
    throw new WorkerStopError('Instance does not have any appCodeVersions')
  }

  const contextVersion = job.instance.contextVersion
  const mainAcv = contextVersion.appCodeVersions.find((acv) => {
    return !acv.additionalRepo
  })

  if (!mainAcv) {
    throw new WorkerStopError('Instance is not repo based')
  }

  return mongo.db.collection('instanceHistory').findOneAndUpdate({
    branch: mainAcv.branch,
    commitSha: mainAcv.commit,
    instanceId: job.instance._id,
    orgGithubId: job.instance.owner.github,
    repo: mainAcv.repo.toLowerCase()
  }, {
    $set: {
      branch: mainAcv.branch,
      commitSha: mainAcv.commit,
      instanceId: job.instance._id,
      orgGithubId: job.instance.owner.github,
      orgName: job.instance.owner.username,
      repo: mainAcv.repo.toLowerCase(),
      build: {
        buildId: contextVersion.build._id,
        containerId: contextVersion.build.dockerContainer,
        failed: contextVersion.build.failed,
        start: contextVersion.build.started,
        stop: contextVersion.build.completed
      },
      application: {
        containerId: _.get(job.instance, 'containers[0].dockerContainer'),
        exitCode: _.get(job.instance, 'containers[0].inspect.State.ExitCode'),
        start: _.get(job.instance, 'containers[0].inspect.State.StartedAt'),
        stop: _.get(job.instance, 'containers[0].inspect.State.FinishedAt')
      }
    }
  }, {
    new: true,
    upsert: true
  })
})
