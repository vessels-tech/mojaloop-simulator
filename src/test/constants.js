const test = require('ava')
const Chance = require('chance')
const uuid = require('uuid/v1')

const chance = new Chance()
const randName = chance.name({ suffix: true, middle: true })
const transferId = uuid()
const idType = 'msisdn'
const idValue = uuid()
const currency = '$'
const amount = 100
const amountType = 'SEND'
const transactionType = 'TRANSFER'

const party = {
  displayName: randName,
  firstName: randName.split(' ')[0] || '',
  middleName: randName.split(' ')[1] || '',
  lastName: randName.split(' ')[2] || '',
  dateOfBirth: '1970-01-01T00:00:00.000Z',
  idType,
  idValue
}

const quote = {
  quoteId: idValue,
  transactionId: uuid(),
  to: {
    idType: 'MSISDN',
    idValue: '0012345'
  },
  from: {
    idType: 'MSISDN',
    idValue: '0067890'
  },
  amountType: 'SEND',
  amount: '100',
  currency: 'USD',
  feesAmount: '0.5',
  feesCurrency: 'USD',
  transactionType: 'TRANSFER',
  initiator: 'PAYER',
  initiatorType: 'CONSUMER'
}

const transfer = {
  transferId,
  quote: {
    quoteId: idValue,
    transactionId: randName,
    transferAmount: amount,
    transferAmountCurrency: currency
  },
  from: {
    idType,
    idValue
  },
  to: {
    idType,
    idValue: '67890'
  },
  amountType,
  currency,
  amount,
  transactionType
}

const newQuote = {
  quoteId: uuid(),
  transactionId: uuid(),
  to: {
    idType: 'MSISDN',
    idValue: '0012345'
  },
  from: {
    idType: 'MSISDN',
    idValue: '0067890'
  },
  amountType: 'SEND',
  amount: '100',
  currency: 'USD',
  feesAmount: '0.5',
  feesCurrency: 'USD',
  transactionType: 'TRANSFER',
  initiator: 'PAYER',
  initiatorType: 'CONSUMER'
}

const newTransfer = {
  transferId: uuid(),
  quote: {
    quoteId: idValue,
    transactionId: randName,
    transferAmount: amount,
    transferAmountCurrency: currency
  },
  from: {
    idType,
    idValue
  },
  to: {
    idType,
    idValue: '67890'
  },
  amountType,
  currency,
  amount,
  transactionType
}

const ops = [
  {
    name: 'scenario1',
    operation: 'postTransfers',
    body: {
      transferId: '5bbd31e2-7a2d-4d13-9013-3a631db62c1e',
      quote: {
        quoteId: '1cd3867e-0c1f-42f3-94a3-1483ded9703b',
        transactionId: 'dcc552ce-d0cd-4827-b730-e4f4300617af',
        transferAmount: '100',
        transferAmountCurrency: 'USD'
      },
      from: {
        idType: 'MSISDN',
        idValue: '123456'
      },
      to: {
        idType: 'MSISDN',
        idValue: '67890'
      },
      amountType: 'SEND',
      currency: 'USD',
      amount: '100',
      transactionType: 'TRANSFER'
    }
  },
  {
    name: 'scenario2',
    operation: 'putTransfers',
    params: {
      transferId: '5bbd31e2-7a2d-4d13-9013-3a631db62c1e'
    }
  }
]

test('constants', async (t) => {
  // to avoid test warnings
  t.pass()
})

module.exports = {
  transfer, quote, party, newQuote, newTransfer, idType, idValue, transferId, ops
}
