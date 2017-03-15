'use strict'

require('dotenv').config({ path: './config/.env' })

const _ = require('lodash')
const expect = require('chai').expect
const instanceUpdatedMock = require('../mocks/instance.updated/exitedCodeZero.json')
const instanceUpdatedWorker = require('../../lib/workers/instance.updated')
const mongo = require('../../lib/mongo')
const Promise = require('bluebird')
const sinon = require('sinon')
const WorkerStopError = require('error-cat/errors/worker-stop-error')

require('sinon-as-promised')(Promise)

describe('instance.updated', () => {
  let findOneAndUpdateStub
  beforeEach(() => {
    findOneAndUpdateStub = sinon.stub().resolves({})
    mongo.db = {
      collection: sinon.stub().returns({
        findOneAndUpdate: findOneAndUpdateStub
      })
    }
  })
  describe('task', () => {
    let taskParams
    beforeEach(() => {
      taskParams = _.cloneDeep(instanceUpdatedMock)
    })
    describe('when instance is missing appcodeVersion', () => {
      beforeEach(() => {
        delete taskParams.instance.contextVersion.appCodeVersions
      })
      it('should throw a worker stop error', () => {
        return instanceUpdatedWorker.task(taskParams)
          .then(() => {
            throw new Error('This should not happen')
          })
          .catch((err) => {
            expect(err).to.be.instanceof(WorkerStopError)
            expect(err.message).to.equal('Instance does not have any appCodeVersions')
          })
      })
    })

    describe('when instance is missing build', () => {
      beforeEach(() => {
        delete taskParams.instance.contextVersion.build
      })
      it('should throw a worker stop error', () => {
        return instanceUpdatedWorker.task(taskParams)
          .then(() => {
            throw new Error('This should not happen')
          })
          .catch((err) => {
            expect(err).to.be.instanceof(WorkerStopError)
            expect(err.message).to.equal('Instance does not have a build')
          })
      })
    })
    describe('when instance has no main repo', () => {
      beforeEach(() => {
        taskParams.instance.contextVersion.appCodeVersions = [{
          additionalRepo: true
        }]
      })
      it('should throw a worker stop error', () => {
        return instanceUpdatedWorker.task(taskParams)
          .then(() => {
            throw new Error('This should not happen')
          })
          .catch((err) => {
            expect(err).to.be.instanceof(WorkerStopError)
            expect(err.message).to.equal('Instance is not repo based')
          })
      })
    })

    describe('when instance is properly defined', () => {
      it('should save instance to mongodb', () => {
        return instanceUpdatedWorker.task(taskParams)
          .then(() => {
            sinon.assert.calledOnce(findOneAndUpdateStub)
            sinon.assert.calledWith(
              findOneAndUpdateStub,
              {
                branch: 'master',
                commitSha: 'b29666337b50119be97d8ba26f53406ba67a38a6',
                instanceId: '58950fb4bf4f611600a0373f',
                orgGithubId: 2335750,
                repo: 'codenow/runnable-angular'
              }, {
                $set: {
                  branch: 'master',
                  commitSha: 'b29666337b50119be97d8ba26f53406ba67a38a6',
                  instanceId: '58950fb4bf4f611600a0373f',
                  orgGithubId: 2335750,
                  orgName: 'CodeNow',
                  repo: 'codenow/runnable-angular',
                  build: {
                    buildId: '58c86e1119a9081300126631',
                    containerId: 'd93776c7007b8f62d0ab519e3f15941640bceb74e32885181cabab03a1d27a2a',
                    failed: false,
                    start: '2017-03-14T22:26:25.853Z',
                    stop: '2017-03-14T22:28:22.147Z'
                  },
                  application: {
                    containerId: '54ca71cb1b1eb37daee05e8dc034af6cdb028f577634494fad74f68c83993a25',
                    exitCode: 0,
                    start: '2017-03-14T22:28:23.51183035Z',
                    stop: '2017-03-14T22:30:04.960876778Z'
                  }
                }
              }, {
                new: true, upsert: true
              }
            )
          })
      })
    })
  })
})
