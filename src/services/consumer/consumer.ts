import { IConsumerService } from './consumer.types'
// import { IBlocksService, BlocksService } from '../blocks'
import { Header } from '@polkadot/types/interfaces'
import { IPolkadotModule } from '@modules/polkadot'
import { ILogger } from '@modules/logger/ILogger'
import { inject, injectable, LazyServiceIdentifer } from 'inversify'
import { IBlockRepository } from '@repositories/blocks/IBlockRepository'
import { IBlocksService } from '@services/blocks'

@injectable()
class ConsumerService implements IConsumerService {
  constructor(
    @inject(IPolkadotModule) protected polkadotApi: IPolkadotModule,
    @inject(ILogger) protected logger: ILogger,
    @inject(IBlockRepository) protected blockRepository: IBlockRepository,
    @inject(new LazyServiceIdentifer(() => IBlocksService)) protected blocksService: IBlocksService
  ) {}
  /**
   * Subscribe to finalized heads stream
   *
   * @async
   * @returns {Promise<void>}
   */
  async subscribeFinalizedHeads(): Promise<void> {
    if (!this.blocksService.isSyncComplete()) {
      this.logger.error(`failed setup "subscribeFinalizedHeads": sync in process`)
      return
    }

    this.logger.info(`Starting subscribeFinalizedHeads`)

    const blockNumberFromDB = await this.blockRepository.getLastProcessedBlock()

    if (blockNumberFromDB === 0) {
      this.logger.warn(`"subscribeFinalizedHeads" capture enabled but, not synchronized blocks `)
    }

    await this.polkadotApi.subscribeFinalizedHeads((header) => this.onFinalizedHead(header))
  }

  private async onFinalizedHead(blockHash: Header): Promise<void> {
    // const blocksService: IBlocksService = new BlocksService()

    const blockNumberFromDB = await this.blockRepository.getLastProcessedBlock()
    const blockNumber = blockHash.number.toNumber()

    if (blockNumber === blockNumberFromDB) {
      return
    }

    this.logger.info({ blockHash }, `Captured new finalized block `)

    try {
      await this.blocksService.processBlock(blockNumber, false)
    } catch (error) {
      this.logger.error({ error }, `failed to process captured block #${blockHash}:`)
    }
  }
}

export { ConsumerService }
