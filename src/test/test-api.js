const test = require('ava')

const { map } = require('../test-api/handlers')
const { ops } = require('./constants')

test.beforeEach(async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context = { state: {}, response: {} }
})

test('create a party', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.request = { body: ops }
  await map['/scenarios'].post(t.context)
  t.truthy(t.context.response.body)
  t.is(t.context.response.status, 400)
})

test('should return 500 when sending a non valid ops', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.request = { body: { hello: 'world' } }
  await map['/scenarios'].post(t.context)
  t.truthy(t.context.response.body)
  t.is(t.context.response.status, 500)
})
