import { createInterface } from '@modules/common/functions/createInterface'

export const IConsumerService = createInterface<IConsumerService>('IConsumerService')

export interface IConsumerService {
  subscribeFinalizedHeads(): Promise<void>
}
