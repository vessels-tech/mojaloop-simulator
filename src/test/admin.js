const test = require('ava')

const Model = require('../models/model')
const { map } = require('../test-api/handlers')
const { party, idType, idValue } = require('./constants')

test.beforeEach(async (t) => {
  const model = new Model()
  await model.init(':memory:')
  // eslint-disable-next-line no-param-reassign
  t.context = { state: { model }, response: {} }
})

test.afterEach(async (t) => {
  await t.context.state.model.close()
})

test('create a party', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.request = { body: party }
  await map['/repository/parties'].post(t.context)
  t.is(t.context.response.status, 204)
  const data = await t.context.state.model.party.get(idType, idValue)
  t.truthy(data)
})

test('should return 500 when creating a non valid party', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.request = { body: { hello: 'world' } }
  await map['/repository/parties'].post(t.context)
  t.truthy(t.context.response.body)
  t.is(t.context.response.status, 500)
})
