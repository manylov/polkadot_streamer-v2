import 'reflect-metadata'
import { Container } from 'inversify'

import { Environment } from '@modules/environment/Environment'
import { Logger, ILogger } from '@modules/logger'
import { PgStorage } from '@modules/storage/PgStorage'
import { App } from '@modules/main/App'
import { PolkadotModule, IPolkadotModule } from '@modules/polkadot'

import { BlocksService, IBlocksService } from '@services/blocks'
import { ConfigService, IConfigService } from '@services/config'
import { ConsumerService, IConsumerService } from '@services/consumer'
import { ExtrinsicsService, IExtrinsicsService } from '@services/extrinsics'
import { RunnerService, IRunnerService } from '@services/runner'
import { StakingService, IStakingService } from '@services/staking'
import { WatchdogService, IWatchdogService } from '@services/watchdog'

import { IBlockRepository, BlockRepository } from '@repositories/blocks'
import { IConfigRepository, ConfigRepository } from '@repositories/config'
import { IEraRepository, EraRepository } from '@repositories/era'
import { IEventRepository, EventRepository } from '@repositories/event'
import { IExtrinsicRepository, ExtrinsicRepository } from '@repositories/extrinsic'

export const container = new Container()

container.bind(ILogger).to(Logger).inSingletonScope()
container.bind(IPolkadotModule).to(PolkadotModule).inSingletonScope()
container.bind(IBlocksService).to(BlocksService).inSingletonScope()
container.bind(IConfigService).to(ConfigService).inSingletonScope()
container.bind(IConsumerService).to(ConsumerService).inSingletonScope()
container.bind(IExtrinsicsService).to(ExtrinsicsService).inSingletonScope()
container.bind(IRunnerService).to(RunnerService).inSingletonScope()
container.bind(IStakingService).to(StakingService).inSingletonScope()
container.bind(IWatchdogService).to(WatchdogService).inSingletonScope()
container.bind(IBlockRepository).to(BlockRepository).inSingletonScope()
container.bind(IConfigRepository).to(ConfigRepository).inSingletonScope()
container.bind(IEraRepository).to(EraRepository).inSingletonScope()
container.bind(IEventRepository).to(EventRepository).inSingletonScope()
container.bind(IExtrinsicRepository).to(ExtrinsicRepository).inSingletonScope()

container
  .bind(Environment)
  .toDynamicValue(async () => {
    const env = Environment.create()
    await env.initialize()
    return env
  })
  .inSingletonScope()
  .onActivation((context, env) => {
    context.container.get(ILogger).setLevel(env.LOG_LEVEL)
    return env
  })

container.bind(App).toSelf().inSingletonScope()
container.bind(PgStorage).toSelf().inSingletonScope()
