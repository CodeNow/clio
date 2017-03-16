# Clio Client

### Configuration
Clio client depends on an environment variable `CLIO_HTTP_URL` which should be set to the root of clio's http server, ex: `http://clio.runnable-gamma.com:8001/`

### Usage
```javascript
const clioClient = require('@runnable/clio-client')
clioClient.fetchInstanceHistory('instanceId')
  .then((history) => {console.log('History! ', history)})
```
