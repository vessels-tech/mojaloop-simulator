const test = require('ava')

const Model = require('../models/model')
const { map } = require('../simulator/handlers')
const {
  transfer, quote, party, idType, idValue
} = require('./constants')

test.beforeEach(async (t) => {
  const model = new Model()
  await model.init(':memory:')
  // eslint-disable-next-line no-param-reassign
  t.context = {
    state: { model }, response: {}
  }
})

test.afterEach(async (t) => {
  await t.context.state.model.close()
})

test('get a party', async (t) => {
  await t.context.state.model.party.create(party)
  // eslint-disable-next-line no-param-reassign
  t.context.state.path = { params: { idValue, idType } }
  await map['/parties/{idType}/{idValue}'].get(t.context)
  t.truthy(t.context.response.body)
  t.is(t.context.response.status, 200)
})

test('create a quote', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.request = { body: quote }
  await map['/quoterequests'].post(t.context)
  t.truthy(t.context.response.body)
  t.is(t.context.response.status, 200)
})

test('create a transfer', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.request = { body: transfer }
  await map['/transfers'].post(t.context)
  t.truthy(t.context.response.body)
  t.is(t.context.response.status, 200)
})

test('get a participant', async (t) => {
  const { state: { model } } = t.context
  // eslint-disable-next-line no-param-reassign
  t.context.state.path = { params: { idValue, idType } }
  await model.party.create(party)
  await map['/participants/{idType}/{idValue}'].get(t.context)
  t.truthy(t.context.response.body)
  t.assert({}.hasOwnProperty.call(t.context.response.body, 'fspId'))
  t.is(t.context.response.status, 200)
})

test('should return 404 while getting a non existing party', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.state.path = { params: { idValue: 'invalidID0001', idType: 'invalidType' } }
  await map['/parties/{idType}/{idValue}'].get(t.context)
  t.falsy(t.context.response.body)
  t.is(t.context.response.status, 404)
})

test('should return 404 while posting a non valid quote object', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.request = { body: { hello: 'world' } }
  await map['/quoterequests'].post(t.context)
  t.falsy(t.context.response.body)
  t.is(t.context.response.status, 400)
})

test('should return 404 while posting a non valid transfer object', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.request = { body: { hello: 'world' } }
  await map['/transfers'].post(t.context)
  t.falsy(t.context.response.body)
  t.is(t.context.response.status, 400)
})

test('should return 404 while getting a non existing participant', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.state.path = { params: { idValue: 'invalidID0001', idType: 'invalidType' } }
  await map['/participants/{idType}/{idValue}'].get(t.context)
  t.falsy(t.context.response.body)
  t.is(t.context.response.status, 404)
})
