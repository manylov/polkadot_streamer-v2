import { createInterface } from '@modules/common/functions/createInterface'

export const IEventRepository = createInterface<IEventRepository>('IEventRepository')

export interface IEventRepository {
  getEventCountByBlock(blockId: number): Promise<number>
}
