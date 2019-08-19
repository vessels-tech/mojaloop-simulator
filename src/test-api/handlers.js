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
    try {
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
    } catch (error) {
      throw error
    }
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
