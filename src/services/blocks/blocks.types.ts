import { createInterface } from '@modules/common/functions/createInterface'
import { AnyJson } from '@polkadot/types/types'

export interface IBlocksStatusResult {
  status: string
  fin_height_diff: number
  height_diff: number
}

export interface IBlockData {
  block: {
    header: {
      number: number
      hash: string
      author: string
      session_id: number
      currentEra: number
      era: number
      stateRoot: string
      extrinsicsRoot: string
      parentHash: string
      last_log: string
      digest: string
    }
  }
  events: IEvent[]
  block_time: number
}

export interface IEvent {
  id: string
  section: string
  method: string
  phase: AnyJson
  meta: Record<string, AnyJson>
  data: any[]
  event: Record<string, AnyJson>
}

export enum SyncStatus {
  SYNC,
  SUBSCRIPTION
}

export const IBlocksService = createInterface<IBlocksService>('IBlocksService')

export interface IBlocksService {
  processBlock(blockNumber: number, fromWatchdog: boolean): Promise<void>
  processBlocks(startBlockNumber: number | undefined, optionSubscribeFinHead: boolean | null): Promise<void>
  getBlocksStatus(): Promise<IBlocksStatusResult>
  isSyncComplete(): boolean
}
