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

const { Logger, Transports } = require('@internal/log')
const Koa = require('koa')
const koaBody = require('koa-body')
const randomPhrase = require('@internal/randomphrase')
const Validate = require('@internal/validate')
const yaml = require('yamljs')
const util = require('util')
const router = require('@internal/router')
const https = require('https')
const simHandlers = require('./simulator/handlers')
const reportHandlers = require('./reports/handlers')
const testApiHandlers = require('./testApi/handlers')

const { setConfig, getConfig } = require('./config.js')
const Model = require('./models/model')
const { evaluate } = require('./rulesEngine')

require('dotenv').config()

const simApiSpec = yaml.load('src/simulator/api.yaml')
const reportApiSpec = yaml.load('src/reports/api.yaml')
const testApiSpec = yaml.load('src/testApi/api.yaml')

const simulator = new Koa()
const report = new Koa()
const testApi = new Koa();

(async function start () {
  // Set up the config from the environment
  await setConfig(process.env)

  // Set up a logger for each running server
  const space = Number(process.env.LOG_INDENT)
  const transports = await Promise.all([
    Transports.consoleDir(),
    Transports.sqlite(process.env.SQLITE_LOG_FILE)
  ])
  const simLogger = new Logger({ context: { app: 'simulator' }, space, transports })
  const reportLogger = new Logger({ context: { app: 'report' }, space, transports })
  const testApiLogger = new Logger({ context: { app: 'testApi' }, space, transports })

  // Initialise the model
  const model = new Model()
  await model.init(process.env.MODEL_DATABASE)

  // Log raw to console as a last resort- if the logging framework crashes
  const failSafe = async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Error in logging framework. Logging to console.', util.inspect(err, { depth: Infinity }))
    }
  }
  simulator.use(failSafe)
  report.use(failSafe)
  testApi.use(failSafe)
  simulator.use(koaBody())
  report.use(koaBody())
  testApi.use(koaBody())

  // Add a log context for each request, log the receipt and handling thereof
  simulator.use(async (ctx, next) => {
    ctx.state.logger = simLogger.push({
      request: {
        id: randomPhrase(),
        path: ctx.path,
        method: ctx.method
      }
    })
    ctx.state.logger.push({ body: ctx.request.body }).log('Request received')
    try {
      await next()
    } catch (err) {
      ctx.state.logger.push(err).log('Error')
    }
    ctx.state.logger.log('Request processed')
  })

  // Add engine validation for each simulator request
  simulator.use(async (ctx, next) => {
    ctx.state.logger.log('Rules engine validating request')
    const facts = {
      path: ctx.path,
      body: ctx.request.body
    }
    const res = await evaluate(facts)
    if (res) {
      const { message, statusCode } = res
      ctx.state.logger.push(message).log('Request failed rules engine validation.')
      ctx.response.status = statusCode
      ctx.response.body = {
        message,
        statusCode
      }
    }
    await next()
  })

  report.use(async (ctx, next) => {
    ctx.state.logger = reportLogger.push({
      request: {
        id: randomPhrase(),
        path: ctx.path,
        method: ctx.method
      }
    })
    ctx.state.logger.log('Request received')
    try {
      await next()
    } catch (err) {
      ctx.state.logger.push(err).log('Error')
    }
    ctx.state.logger.log('Request processed')
  })

  testApi.use(async (ctx, next) => {
    ctx.state.logger = testApiLogger.push({
      request: {
        id: randomPhrase(),
        path: ctx.path,
        method: ctx.method
      }
    })
    ctx.state.logger.log('Request received')
    try {
      await next()
    } catch (err) {
      ctx.state.logger.push(err).log('Error')
    }
    ctx.state.logger.log('Request processed')
  })

  // Add validation and data model for each simulator request
  const simValidator = new Validate()

  simulator.use(async (ctx, next) => {
    ctx.state.logger.log('Validating request')
    try {
      ctx.state.path = simValidator.validateRequest(ctx, ctx.state.logger)
      ctx.state.logger.log('Request passed validation')
      ctx.state.model = model
      await next()
    } catch (err) {
      ctx.state.logger.push({ err }).log('Request failed validation.')
      ctx.response.status = 400
      ctx.response.body = {
        message: err.message,
        statusCode: 400
      }
    }
  })

  const reportValidator = new Validate()

  report.use(async (ctx, next) => {
    ctx.state.logger.log('Validating request')
    try {
      ctx.state.path = reportValidator.validateRequest(ctx, ctx.state.logger)
      ctx.state.logger.log('Request passed validation')
      await next()
    } catch (err) {
      ctx.state.logger.push({ err }).log('Request failed validation.')
      ctx.response.status = 400
      ctx.response.body = {
        message: err.message,
        statusCode: 400
      }
    }
  })

  const testApiValidator = new Validate()

  testApi.use(async (ctx, next) => {
    ctx.state.logger.log('Validating request')
    try {
      ctx.state.path = testApiValidator.validateRequest(ctx, ctx.state.logger)
      ctx.state.logger.log('Request passed validation')
      await next()
    } catch (err) {
      ctx.state.logger.push({ err }).log('Request failed validation.')
      ctx.response.status = 400
      ctx.response.body = {
        message: err.message,
        statusCode: 400
      }
    }
  })

  // Handle requests
  simulator.use(router(simHandlers.map))
  report.use(router(reportHandlers.map))
  testApi.use(router(testApiHandlers.map))

  await Promise.all([
    simValidator.initialise(simApiSpec),
    reportValidator.initialise(reportApiSpec),
    testApiValidator.initialise(testApiSpec)
  ])

  // If config specifies TLS, start an HTTPS server; otherwise HTTP
  let simServer
  const conf = getConfig()
  const simulatorPort = 3000
  const reportPort = 3002
  const testApiPort = 3003

  if (conf.tls.mutualTLS.enabled || conf.tls.enabled) {
    if (!(conf.tls.creds.ca && conf.tls.creds.cert && conf.tls.creds.key)) {
      throw new Error(
        'Incompatible parameters.\n' +
                `Mutual TLS enabled: ${conf.tls.mutualTLS.enabled}.\n` +
                `HTTPS enabled: ${conf.tls.enabled}.\n` +
                `Server key present: ${conf.tls.creds.key !== null}.\n` +
                `CA cert present: ${conf.tls.creds.ca !== null}.\n` +
                `Server cert present: ${conf.tls.creds.cert !== null}`
      )
    }
    const httpsOpts = {
      ...conf.tls.creds,
      requestCert: conf.tls.mutualTLS.enabled,
      rejectUnauthorized: true // no effect if requestCert is not true
    }
    simServer = https.createServer(httpsOpts, simulator.callback()).listen(simulatorPort)
  } else {
    simServer = simulator.listen(simulatorPort)
  }
  simLogger.log(`Serving simulator on port ${simulatorPort}`)
  const reportServer = report.listen(reportPort)
  reportLogger.log(`Serving report API on port ${reportPort}`)
  const testApiServer = testApi.listen(testApiPort)
  testApiLogger.log(`Serving test API on port ${testApiPort}`)

  // Gracefully handle shutdown. This should drain the servers.
  process.on('SIGTERM', () => {
    simServer.close()
    reportServer.close()
    testApiServer.close()
  })
}()).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
