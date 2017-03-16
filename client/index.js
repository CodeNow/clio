const request = require('request-promise')
const baseUrl = process.env.CLIO_HTTP_URL
const defaultOptions = {
  json: true,
  timeout: 3000
}

module.exports = {
  fetchInstanceHistory: (instanceId) => {
    return request.get(`${baseUrl}instances/${instanceId}/history`, defaultOptions)
  }
  fetchContainerInstance: (containerId) => {
    return request.get(`${baseUrl}containers/${containerId}/instance`, defaultOptions)
  }
}
