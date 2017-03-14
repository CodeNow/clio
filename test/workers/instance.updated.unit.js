const instanceUpdatedWorker = require('../../lib/workers/instance.updated')

describe('instance.updated', () => {
  describe('task', () => {
    describe('when instance is missing build', () => {
      it('should throw a worker stop error', () => {
        instanceUpdatedWorker.task()
      })
    })
  })
})
