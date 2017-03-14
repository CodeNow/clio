'use strict'

require('loadenv')()

const bunyan = require('bunyan')
const _ = require('lodash')
const cls = require('continuation-local-storage')

const serializers = {
  tx: function () {
    let out
    try {
      out = {
        tid: cls.getNamespace('ponos').get('tid')
      }
    } catch (e) {
      // cant do anything here
    }
    return out
  },
  instance: function (instance) {
    return _.pick(instance, [
      '_id',
      'name',
      'owner',
      'contextVersions.appCodeVersions',
      'contextVersion.build._id',
      'contextVersion.build.dockerContainer',
      'contextVersion.build.failed',
      'contextVersion.build.started',
      'contextVersion.build.completed',
      'container.inspect.State',
      'container.dockerContainer'
    ])
  },
  job: function (job) {
    return Object.keys(job).map((key) => {
      if (serializers[key]) {
        return serializers[key](job[key])
      }
      return job[key]
    })
  }
}
_.defaults(serializers, bunyan.stdSerializers)

/**
 * The default logger for pheidi.
 * @type {bunyan}
 */
module.exports = bunyan.createLogger({
  name: process.env.APP_NAME,
  streams: [{ level: process.env.LOG_LEVEL, stream: process.stdout }],
  serializers: serializers,
  src: true
}).child({ tx: true })
