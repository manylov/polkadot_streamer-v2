import { IRunnerService } from './runner.types'
import { IBlocksService } from '@services/blocks'
import { IConfigService } from '@services/config'
import { IWatchdogService } from '@services/watchdog/'
import { IConsumerService } from '@services/consumer'
import { inject, injectable } from 'inversify'

@injectable()
class RunnerService implements IRunnerService {
  constructor(
    @inject(IConsumerService) protected consumerService: IConsumerService,
    @inject(IBlocksService) protected blocksService: IBlocksService,
    @inject(IConfigService) protected configService: IConfigService,
    @inject(IWatchdogService) protected watchdogService: IWatchdogService
  ) {}

  async sync(options: Parameters<IRunnerService['sync']>[0]): Promise<void> {
    await this.configService.bootstrapConfig()

    if (options.optionSync || options.optionSyncForce) {
      const startBlock: number | undefined = options.optionSyncForce ? 0 : options.optionSyncStartBlockNumber
      await this.blocksService.processBlocks(startBlock, options.optionSubscribeFinHead)
      return
    }

    if (options.optionSubscribeFinHead) {
      await this.consumerService.subscribeFinalizedHeads()
      return
    }

    if (options.optionStartWatchdog) {
      await this.watchdogService.run(options.optionWatchdogStartBlockNumber)
      return
    }
  }
}

export { RunnerService }
