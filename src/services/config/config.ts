import { IConfigService } from './config.types'

import { IPolkadotModule } from '@modules/polkadot'
import { ILogger } from '@modules/logger/ILogger'
import { IConfigRepository } from '@repositories/config/IConfigRepository'
import { inject, injectable } from 'inversify'

const INITIAL_VERIFY_HEIGHT = -1

@injectable()
class ConfigService implements IConfigService {
  constructor(
    @inject(ILogger) protected logger: ILogger,
    @inject(IPolkadotModule) protected polkadotApi: IPolkadotModule,
    @inject(IConfigRepository) protected configRepository: IConfigRepository
  ) {}

  async bootstrapConfig(): Promise<void> {
    const [currentChain, currentChainType] = await this.polkadotApi.getChainInfo()

    const [dbChain, dbChainType] = await Promise.all([
      this.getConfigValueFromDB('chain'),
      this.getConfigValueFromDB('chain_type')
    ])

    if (!dbChain && !dbChainType) {
      this.logger.info({ currentChainType, currentChain }, `Init new chain config"`)
      await Promise.all([
        this.setConfigValueToDB('chain', currentChain),
        this.setConfigValueToDB('chain_type', currentChainType)
      ])
    } else {
      if (dbChain !== currentChain) {
        throw new Error(`Node "system.chain" not compare to saved type: "${currentChain}" and "${dbChain}"`)
      }

      if (dbChainType !== currentChainType) {
        throw new Error(`Node "system.chainType" not compare to saved type: "${currentChainType}" and "${dbChainType}"`)
      }
    }

    const [watchdogVerifyHeight, watchdogStartedAt, watchdogFinishedAt] = await Promise.all([
      this.getConfigValueFromDB('watchdog_verify_height'),
      this.getConfigValueFromDB('watchdog_started_at'),
      this.getConfigValueFromDB('watchdog_finished_at')
    ])

    if (!watchdogVerifyHeight) {
      await this.setConfigValueToDB('watchdog_verify_height', INITIAL_VERIFY_HEIGHT)
    }

    if (!watchdogStartedAt) {
      await this.setConfigValueToDB('watchdog_started_at', 0)
    }

    if (!watchdogFinishedAt) {
      await this.setConfigValueToDB('watchdog_finished_at', 0)
    }
  }

  async setConfigValueToDB(key: string, value: string | number): Promise<void> {
    const valueToSave = value.toString()

    if (!key.length) {
      throw new Error('"key" is empty')
    }

    if (!valueToSave.length) {
      throw new Error(`setConfigValueToDB "value" for key ${key} is empty`)
    }

    await this.configRepository.insert(key, valueToSave)
  }

  async getConfigValueFromDB(key: string): Promise<string | undefined> {
    if (!key.length) {
      throw new Error('"key" is empty')
    }

    return this.configRepository.find(key)
  }

  async updateConfigValueInDB(key: string, value: string | number): Promise<void> {
    if (!key.length) {
      throw new Error('updateConfigValueInDB "key" is empty')
    }

    return this.configRepository.update(key, value)
  }
}

/**
 *
 * @type {{ConfigService: ConfigService}}
 */
export { ConfigService }
