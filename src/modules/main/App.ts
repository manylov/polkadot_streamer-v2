import { inject, injectable, postConstruct } from 'inversify'
import { ILogger } from '../logger/ILogger'
import { Environment } from '../environment/Environment'
import { PgStorage } from '../storage/PgStorage'
import { IRunnerService } from '@services/runner'
import yargs from 'yargs'
// import { Server } from '../server/Server'

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
export class App {
  public constructor(
    @inject(ILogger) protected logger: ILogger,
    @inject(Environment) protected env: Environment,
    @inject(PgStorage) protected pgStorage: PgStorage,
    @inject(IRunnerService) protected runnerService: IRunnerService
  ) {}

  @postConstruct()
  public async initialize() {
    this.logger.info('App initialized')
  }

  public async start() {
    this.logger.info('App started')
    this.runnerService.sync({
      optionSync: argv['sync-force'] ? false : argv.sync,
      optionSyncForce: argv['sync-force'],
      optionSyncStartBlockNumber: argv.start,
      optionSubscribeFinHead: argv['sub-fin-head'],
      optionStartWatchdog: argv['watchdog'],
      optionWatchdogStartBlockNumber: argv['watchdog-start']
    })
  }

  public async close() {
    this.logger.info(`Closing application`)
    await this.pgStorage.close()
  }
}
