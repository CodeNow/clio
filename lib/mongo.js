/**
 * Exports a singleton instance of the Mongodb class. Wrapper methods for
 * database operations.
 * @module lib/mongo
 */
'use strict'

const _ = require('lodash')
const fs = require('fs')
const MongoClient = require('mongodb').MongoClient
const Promise = require('bluebird')

// internal
const log = require('./logger').child({
  module: 'mongo'
})

module.exports = new Mongodb()

let ca
let key
let cert

/**
 * @class
 */
function Mongodb () {
  this.host = process.env.MONGO
  this.db = null

  if (process.env.MONGO_CACERT &&
    process.env.MONGO_CERT &&
    process.env.MONGO_KEY
  ) {
    try {
      log.info('loading mongodb certificates')
      ca = ca || fs.readFileSync(process.env.MONGO_CACERT, 'utf-8')
      key = key || fs.readFileSync(process.env.MONGO_KEY, 'utf-8')
      cert = cert || fs.readFileSync(process.env.MONGO_CERT, 'utf-8')
      this.ssl = {
        ssl: true,
        sslValidate: true,
        sslCA: ca,
        sslKey: key,
        sslCert: cert
      }
    } catch (err) {
      log.fatal({
        err: err
      }, 'could not read provided mongo certificates')
    }
  }
}

Mongodb.prototype.connect = function () {
  log.info({ mongodbHost: this.host }, 'Mongodb.prototype.connect')
  let opts = {
    promiseLibrary: Promise
  }
  if (process.env.MONGO_REPLSET_NAME) {
    opts.replset = {
      rs_name: process.env.MONGO_REPLSET_NAME
    }
  }
  if (this.ssl) {
    opts = _.assign(opts, { server: this.ssl })
    log.trace('mongodb connecting with ssl')
  } else {
    log.warn('mongdb connecting without ssl')
  }
  return MongoClient.connect(this.host, opts)
    .then((db) => {
      log.trace({ host: this.host }, 'Mongodb.prototype.connect connect success')
      this.db = db
    })
    .catch((error) => {
      log.error({
        host: this.host,
        error
      }, 'Mongodb.prototype.connect connect error')
      throw err
    })
}

Mongodb.prototype.close = function () {
  return this.db.close()
}
