import { IBlockData } from '@services/blocks/'
import { IBlock } from '../../services/watchdog/watchdog.types'
import { createInterface } from '@modules/common/functions/createInterface'

export const IBlockRepository = createInterface<IBlockRepository>('IBlockRepository')

export interface IBlockRepository {
  addNewBlock(blockData: IBlockData): Promise<void>
  isEmpty(): Promise<boolean>
  getBlockById(blockId: number): Promise<any>
  getLastProcessedBlock(): Promise<number>
  getFirstBlockInEra(eraId: number): Promise<IBlock | null>
  getFirstBlockInSession(sessionId: number): Promise<IBlock>
}
