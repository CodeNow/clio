'use strict'

const bunyan = require('bunyan')
const _ = require('lodash')
const cls = require('continuation-local-storage')

function deepSerialize (data) {
  return Object.keys(data).map((key) => {
    if (serializers[key]) {
      return serializers[key](data[key])
    }
    return data[key]
  })
}

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
  job: deepSerialize,
  originalJobPayload: deepSerialize,
  data: deepSerialize,
  error: deepSerialize
}
_.defaults(serializers, bunyan.stdSerializers)

/**
 * The default logger for pheidi.
 * @type {bunyan}
 */
module.exports = bunyan.createLogger({
  name: process.env.APP_NAME,
  streams: [{ level: process.env.LOG_LEVEL, stream: process.stdout }],
  serializers,
  src: true
}).child({ tx: true })
