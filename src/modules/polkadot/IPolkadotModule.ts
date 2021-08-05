import { createInterface } from '../common/functions/createInterface'
import { IBlockEraParams, IEraData, TBlockHash } from '@services/staking'
import {
  ActiveEraInfo,
  BlockHash,
  EraIndex,
  EventIndex,
  EventRecord,
  Exposure,
  Header,
  Moment,
  SessionIndex,
  SignedBlock,
  ValidatorPrefs
} from '@polkadot/types/interfaces'
import { Option, u32, Vec } from '@polkadot/types'
import { HeaderExtended } from '@polkadot/api-derive/types'
export const IPolkadotModule = createInterface<IPolkadotModule>('IPolkadotModule')

export interface IPolkadotModule {
  init(): Promise<void>
  getChainInfo(): Promise<[string, string]>
  getEraData({ eraId, blockHash }: IBlockEraParams): Promise<IEraData>
  getBlockTime(blockHash: TBlockHash): Promise<number>
  getDistinctValidatorsAccountsByEra(blockHash: string): Promise<Set<string>>
  getRewardPoints(blockHash: TBlockHash, eraId: number): Promise<Map<string, number>>
  getStakersInfo(
    blockHash: TBlockHash,
    eraId: number,
    validatorAccountId: string
  ): Promise<[Exposure, Exposure, ValidatorPrefs]>
  getStakingPrefs(blockHash: TBlockHash, eraId: number, validatorAccountId: string): Promise<ValidatorPrefs>
  getStakingPayee(
    blockHash: TBlockHash,
    accountId: string
  ): Promise<{
    reward_dest?: string
    reward_account_id?: string
  }>
  subscribeFinalizedHeads(cb: (header: Header) => Promise<void>): Promise<void>
  getSystemEvents(hash: TBlockHash): Promise<Vec<EventRecord>>
  getBlockData(hash: TBlockHash): Promise<SignedBlock>
  getSystemEventsCount(hash: TBlockHash): Promise<EventIndex>
  getBlockHashByHeight(height: number): Promise<BlockHash>
  getInfoToProcessBlock(
    blockHash: TBlockHash
  ): Promise<
    [
      SessionIndex,
      Option<EraIndex>,
      Option<ActiveEraInfo>,
      SignedBlock,
      HeaderExtended | undefined,
      Moment,
      Vec<EventRecord>
    ]
  >
  getHistoryDepth(blockHash: TBlockHash): Promise<u32>
  getFinBlockNumber(): Promise<number>
  getHeader(): Promise<Header>
  getInfoToCheckHistoryDepth(
    blockHash: TBlockHash
  ): Promise<[SessionIndex, Option<ActiveEraInfo>, HeaderExtended | undefined]>
}
