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
