import { IExtrinsic } from '@services/extrinsics'

import { createInterface } from '@modules/common/functions/createInterface'

export const IExtrinsicRepository = createInterface<IExtrinsicRepository>('IExtrinsicRepository')

export interface IExtrinsicRepository {
  getExtrinsicsCountByBlock(blockId: number): Promise<number>
  saveExtrinsics(extrinsics: IExtrinsic[]): Promise<void>
}
