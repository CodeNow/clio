const request = require('request-promise')

request.defaults({
  baseUrl: `http://${process.env.CLIO_HTTP_URL}`
})

module.exports = {
  fetchInstanceHistory: (instanceId) => {
    return request.get(`instance/${instanceId}/history`)
  }
}
