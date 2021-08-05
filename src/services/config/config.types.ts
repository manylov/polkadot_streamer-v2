import { createInterface } from '@modules/common/functions/createInterface'

export const IConfigService = createInterface<IConfigService>('IConfigService')

export interface IConfigService {
  bootstrapConfig(): Promise<void>
  setConfigValueToDB(key: string, value: string | number): Promise<void>
  getConfigValueFromDB(key: string): Promise<string | undefined>
  updateConfigValueInDB(key: string, value: string | number): Promise<void>
}
