import { createInterface } from '@modules/common/functions/createInterface'
import { IEra } from '@services/watchdog'

export const IEraRepository = createInterface<IEraRepository>('IEraRepository')

export interface IEraRepository {
  getEra(eraId: number): Promise<IEra>
  getEraStakingDiff(eraId: number): Promise<any>
}
