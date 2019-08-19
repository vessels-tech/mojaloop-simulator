/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>

 * Mowali
 --------------
 ******/
'use strict'

const { postTransfers, putTransfers } = require('./client')
const { ApiErrorCodes } = require('../models/errors')

const post = 'postTransfers'
const put = 'putTransfers'

const createParty = async (ctx) => {
  if (!Object.prototype.hasOwnProperty.call(ctx.request.body, 'idValue')) {
    ctx.response.body = ApiErrorCodes.MISSING_ID_VALUE
    ctx.response.status = 500
    return
  }

  try {
    await ctx.state.model.party.create(ctx.request.body)
    ctx.response.status = 204
    return
  } catch (err) {
    ctx.response.body = ApiErrorCodes.ID_NOT_UNIQUE
    ctx.response.status = 500
  }
}

/**
 * Handles all operation scenarios
 *
 * @param {Array} ops  operation scenarios to test
 * @returns {Promise.<Array|void|Boolean>} results
 * @throws
 */
const handleOps = async (ops) => {
  if (!Array.isArray(ops)) {
    throw new Error(ApiErrorCodes.OPS_ERROR.message)
  }
  ops.forEach(async (op) => {
    const results = []
    const { name, operation } = op
    if (!(operation && (operation === post || operation === put))) {
      return false
    }
    if (operation === post) {
      const response = await postTransfers(op.body)
      results.push({ name, operation, response })
    }
    if (operation === put) {
      const response = await putTransfers(op.params.transferId)
      results.push({ name, operation, response })
    }
    return results
  })
}

const handleScenarios = async (ctx) => {
  try {
    const res = await handleOps(ctx.request.body)
    if (res) {
      ctx.response.body = res
      ctx.response.status = 200
      return
    }
    ctx.response.body = ApiErrorCodes.OP_NOT_SET
    ctx.response.status = 400
    return
  } catch (err) {
    ctx.response.body = ApiErrorCodes.OPS_ERROR
    ctx.response.status = 500
  }
}

const map = {
  '/scenarios': {
    post: handleScenarios
  },
  '/repository/parties': {
    post: createParty
  }
}

module.exports = {
  map
}
