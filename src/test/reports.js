/* eslint-disable no-unused-vars */
const test = require('ava')
const { stringify } = require('querystring')
const uuid = require('uuid/v1')

const { map } = require('../reports/handlers')
const Model = require('../models/model')
const { quote } = require('./constants')
require('dotenv').config()

const model = new Model()
const end = new Date()
end.setMonth(end.getMonth() + 2)
const validQuerystring = stringify({ START_DATE_TIME: '2019-05-20T21:20:56', END_DATE_TIME: end.toISOString().slice(0, 19) })
const nonFindableQuerystring = stringify({ START_DATE_TIME: '2019-05-19T21:20:00', END_DATE_TIME: '2019-05-20T21:20:56' })

test.before(async (t) => {
  await model.init(process.env.MODEL_DATABASE)
  Array.from({ length: 10 }).forEach(async (x, i) => {
    quote.quoteId = uuid()
    await model.quote.create(quote)
  })
})

test.beforeEach(async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context = { state: {}, request: {}, response: {} }
})

test.after(async (t) => {
  await model.close()
})

test('get reports', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.request = { querystring: validQuerystring }
  await map['/reports'].get(t.context)
  t.truthy(t.context.response.body)
  t.is(t.context.response.status, 200)
})

test('should return 404 when cannot find report', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.request = { querystring: nonFindableQuerystring }
  await map['/reports'].get(t.context)
  t.truthy(t.context.response.body)
  t.is(t.context.response.status, 404)
})

test('should return 400 when sending invalid querystrings', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.request = { querystring: {} }
  await map['/reports'].get(t.context)
  t.truthy(t.context.response.body)
  t.is(t.context.response.status, 400)
})
