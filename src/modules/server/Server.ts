import Fastify, { FastifyInstance } from 'fastify'
import yargs from 'yargs'
import { Environment } from '../environment/Environment'
import { ILogger } from '../logger/ILogger'
import { postConstruct, injectable, inject } from 'inversify'
import routes from './routes'
import prometheus from './routes/api/prometheus'

const { argv } = yargs
  .option('sync', {
    type: 'boolean',
    default: false,
    description: 'Run synchronization blocks, fetched with db'
  })
  .option('sync-force', {
    type: 'boolean',
    default: false,
    description: 'Run synchronization all blocks'
  })
  .option('start', {
    type: 'number',
    description: 'Start synchronization from block number'
  })
  .option('watchdog', {
    type: 'boolean',
    default: false,
    description: 'Run watchdog'
  })
  .option('watchdog-start', {
    type: 'number',
    description: 'Start watchdog tests from block number'
  })
  .option('sub-fin-head', {
    type: 'boolean',
    default: false,
    description: 'Subscribe to capture finalized heads'
  })
  .option('disable-rpc', {
    alias: 'disable-rpc',
    type: 'boolean',
    default: false,
    description: 'Disable api'
  })
  .help()

@injectable()
export class Server {
  private readonly server: FastifyInstance

  public constructor(@inject(Environment) protected environment: Environment, @inject(ILogger) protected logger: ILogger) {
    this.server = Fastify({
      bodyLimit: 1048576 * 2,
      logger
    })
  }

  @postConstruct()
  public async initialize() {
    console.log('INIT')
    if (!argv['disable-rpc']) {
      try {
        await this.server.register(routes, { prefix: 'api' })
        await this.server.register(prometheus, { prefix: '/' })
      } catch (err) {
        this.logger.error(`Cannot init endpoint: "${err.message}"`)
        this.logger.error(`Stopping instance...`)
        process.exit(1)
      }
    }

    try {
      await this.server.ready()
      this.logger.info('Fastify started')
    } catch (err) {
      throw err
    }
  }
}
