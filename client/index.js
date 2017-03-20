const request = require('request-promise')
const baseUrl = process.env.CLIO_HTTP_URL
const defaultOptions = {
  json: true,
  timeout: 3000
}

module.exports = {
  fetchInstanceHistory: (instanceId) => {
    return request.get(`${baseUrl}instances/${instanceId}/history`, defaultOptions)
  },
  /**
   * Given a container ID find an instance that has ran this container.
   * In the case of builds this has the possibility of being multiple instances since we
   * do build deduping. So.... we return the first instance for the container ID for the moment.
   */
  fetchContainerInstance: (containerId) => {
    return request.get(`${baseUrl}containers/${containerId}/instance`, defaultOptions)
  }
}
