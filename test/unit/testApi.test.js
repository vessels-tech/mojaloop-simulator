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

const test = require('ava')

const { map } = require('../../src/testApi/handlers')
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
