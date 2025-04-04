const test = require('brittle')
const process = require('.')

test('uptime', (t) => {
  t.comment(process.uptime())
})
