const fetch = require('node-fetch')
require('dotenv').config()

const { OUTBOUND_ENDPOINT } = process.env

/**
 * Endpoint call to outbound transfer request initiation
 *
 * @param {Object} body transfer body
 * @returns {Promise.<Object>}     response
 */
const postTransfers = async (body) => {
  try {
    const res = await fetch(`${OUTBOUND_ENDPOINT}/transfers`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
    return await res.json()
  } catch (err) {
    throw new Error(`There was an error during the request ${err}`)
  }
}

/**
 * Endpoint call resuming outbound transfers in scenarios where two-step transfers are enabled
 *
 * @param {String} transferId  transferId must be a uuid
 * @returns {Promise.<Object>}     response
 */
const putTransfers = async (transferId) => {
  try {
    const res = await fetch(`${OUTBOUND_ENDPOINT}/transfers/${transferId}`, { method: 'get' })
    return await res.json()
  } catch (err) {
    throw new Error(`There was an error during the request ${err}`)
  }
}

module.exports = { postTransfers, putTransfers }
