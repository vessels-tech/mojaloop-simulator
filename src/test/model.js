const test = require('ava')

const Model = require('../models/model')
const {
  transfer, quote, party, newQuote, newTransfer, idType, idValue, transferId
} = require('./constants')

test.beforeEach(async (t) => {
  const model = new Model()
  await model.init(':memory:')
  // eslint-disable-next-line no-param-reassign
  t.context = { model }
})

test.afterEach(async (t) => {
  await t.context.model.close()
})

test('create a model with an in-memory database', async (t) => {
  // work is done in beforeEach
  t.pass()
})

test('create a party', async (t) => {
  await t.context.model.party.create(party)
  t.pass()
})

test('create and retrieve a party', async (t) => {
  const { model } = t.context

  await model.party.create(party)
  const res = await model.party.get(idType, idValue)
  if (!res) {
    t.fail('Result not found')
  }
  t.pass()
})

test('create and update a party', async (t) => {
  const { model } = t.context
  const newParty = {
    displayName: 'randName',
    firstName: 'hello',
    middleName: 'world',
    lastName: 'lambda',
    dateOfBirth: '1970-01-01T00:00:00.000Z',
    idType,
    idValue
  }
  await model.party.create(party)
  const orig = await model.party.get(idType, idValue)
  await model.party.update(idValue, newParty)
  const changed = await model.party.get(idType, idValue)
  t.notDeepEqual({ orig }, { changed })
})

test('retrieve a participant', async (t) => {
  const { model } = t.context
  await model.party.create(party)
  const res = await model.party.get(idType, idValue)
  t.truthy(res)
})

test('create and delete a party', async (t) => {
  const { model } = t.context
  await model.party.create(party)
  await model.party.get(idType, idValue)
  await model.party.delete(idType, idValue)
  const deleted = await model.party.get(idType, idValue)
  t.is(deleted, undefined)
})

test('should be undefined for non existing participant', async (t) => {
  const { model } = t.context
  const res = await model.party.get('hello', '000000')
  t.is(res, undefined)
})

test('should be undefined for deleted participant', async (t) => {
  const { model } = t.context
  await model.party.create(party)
  await model.party.get(idType, idValue)
  await model.party.delete(idType, idValue)
  const deleted = await model.party.get(idType, idValue)
  t.is(deleted, undefined)
})

test('create a quote', async (t) => {
  await t.context.model.quote.create(quote)
  t.pass()
})

test('create and retrieve a quote', async (t) => {
  const { model } = t.context

  await model.quote.create(quote)
  const res = await model.quote.get(idValue)
  if (!res) {
    t.fail('Result not found')
  }
  t.pass()
})

test('created quote has correct fees', async (t) => {
  const { model } = t.context

  const q = await model.quote.create(quote)

  if (q.payeeFspFeeAmount !== '5') {
    return t.fail(`Fee is ${q.payeeFspFeeAmount}`)
  }
  if (q.payeeFspCommissionAmount !== '5') {
    return t.fail(`Fee is ${q.payeeFspCommissionAmount}`)
  }

  return t.pass()
})

test('created quote has correct fees when transfer amount is small', async (t) => {
  const { model } = t.context

  const smq = { ...quote }
  smq.amount = 1

  const q = await model.quote.create(smq)

  if (q.payeeFspFeeAmount !== '0') {
    return t.fail(`Fee is ${q.payeeFspFeeAmount}`)
  }
  if (q.payeeFspCommissionAmount !== '0') {
    return t.fail(`Fee is ${q.payeeFspCommissionAmount}`)
  }

  return t.pass()
})

test('create and update a quote', async (t) => {
  const { model } = t.context

  await model.quote.create(quote)
  const orig = await model.quote.get(idValue)
  await model.quote.update(idValue, newQuote)
  const changed = await model.quote.get(idValue)
  t.notDeepEqual({ orig }, { changed })
})

test('create and delete a quote', async (t) => {
  const { model } = t.context
  await model.quote.create(quote)
  await model.quote.get(idValue)
  await model.quote.delete(idValue)
  const deleted = await model.quote.get(idValue)
  t.is(deleted, undefined)
})

test('create a transfer', async (t) => {
  await t.context.model.transfer.create(transfer)
  t.pass()
})

test('create and retrieve a transfer', async (t) => {
  const { model } = t.context

  await model.transfer.create(transfer)
  const res = await model.transfer.get(transferId)
  if (!res) {
    t.fail('Result not found')
  }
  t.pass()
})

test('create and update a transfer', async (t) => {
  const { model } = t.context

  await model.transfer.create(transfer)
  const orig = await model.transfer.get(idValue)
  await model.transfer.update(idValue, newTransfer)
  const changed = await model.transfer.get(idValue)
  t.notDeepEqual({ orig }, { changed })
})

test('create and delete a transfer', async (t) => {
  const { model } = t.context
  await model.transfer.create(transfer)
  await model.transfer.get(transferId)
  await model.transfer.delete(transferId)
  const deleted = await model.transfer.get(transferId)
  t.is(deleted, undefined)
})
