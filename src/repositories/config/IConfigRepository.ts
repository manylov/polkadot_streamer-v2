import { createInterface } from '@modules/common/functions/createInterface'

export const IConfigRepository = createInterface<IConfigRepository>('IConfigRepository')

export interface IConfigRepository {
  update(key: string, value: string | number): Promise<void>
  find(key: string): Promise<string | undefined>
  insert(key: string, value: string | number): Promise<void>
}
