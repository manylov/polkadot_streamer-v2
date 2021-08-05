import { IEventRepository } from './IEventRepository'
import { Environment } from '@modules/environment/Environment'
import { PgStorage } from '@modules/storage/PgStorage'
import { ILogger } from '@modules/logger/ILogger'
import { inject, injectable } from 'inversify'

@injectable()
export class EventRepository implements IEventRepository {
  private schema: string

  constructor(
    @inject(Environment) protected env: Environment,
    @inject(ILogger) protected logger: ILogger,
    @inject(PgStorage) protected connectionProvider: PgStorage
  ) {
    this.schema = this.schema = env.DB_SCHEMA
  }

  async getEventCountByBlock(blockId: number): Promise<number> {
    const {
      rows: [{ count }]
    } = await this.connectionProvider.query({
      text: `SELECT count(*) FROM ${this.schema}.events WHERE "block_id" = $1::int`,
      values: [blockId]
    })

    return +count
  }
}
