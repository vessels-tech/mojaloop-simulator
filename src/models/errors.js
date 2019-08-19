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

const ApiErrorCodes = {
  MISSING_ID_VALUE: { code: 1000, message: 'ID not supplied' },
  ID_NOT_UNIQUE: { code: 1001, message: 'ID is already registered' },
  UNKNOWN_ERROR: { code: 1002, message: 'ID not supplied' },

  // reporting errors
  REPORT_NOT_FOUND: { code: 6000, message: 'Report not found' },
  REPORT_EMPTY: { code: 6001, message: 'Report has no content' },
  REPORT_ERROR: { code: 6002, message: 'There was an error while finding Report' },
  // test api errors
  OP_NOT_SET: { code: 7000, message: 'Scenario operation isn\'t specified' },
  OPS_ERROR: { code: 7001, message: 'There was an error while processing operations' }

}

module.exports = { ApiErrorCodes }
