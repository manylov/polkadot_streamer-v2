import { createInterface } from '@modules/common/functions/createInterface'

export const IRunnerService = createInterface<IRunnerService>('IRunnerService')

export interface IRunnerService {
  sync(options: {
    optionSync: boolean
    optionSyncForce: boolean
    optionSyncStartBlockNumber: number | undefined
    optionSubscribeFinHead: boolean
    optionStartWatchdog: boolean
    optionWatchdogStartBlockNumber: number | undefined
  }): Promise<void>
}
