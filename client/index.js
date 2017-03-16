const request = require('request-promise')
const baseUrl = process.env.CLIO_HTTP_URL

module.exports = {
  fetchInstanceHistory: (instanceId) => {
    return request.get(`${baseUrl}instances/${instanceId}/history`, {
      json: true
    })
  },
  fetchContainerInstance: (containerId) => {
    return request.get(`${baseUrl}containers/${containerId}/instance`, {
      json: true
    })
  }
}
