const request = require('request-promise').defaults({
  baseUrl: process.env.CLIO_HTTP_URL
})

module.exports = {
  fetchInstanceHistory: (instanceId) => {
    return request.get(`instances/${instanceId}/history`, {
      json: true
    })
  }
}
