import { IEraRepository } from './IEraRepository'
import { IEra } from '@services/watchdog'
import { inject, injectable } from 'inversify'
import { Environment } from '@modules/environment/Environment'
import { PgStorage } from '@modules/storage/PgStorage'
import { ILogger } from '@modules/logger/ILogger'

@injectable()
export class EraRepository implements IEraRepository {
  private schema: string

  constructor(
    @inject(Environment) protected env: Environment,
    @inject(ILogger) protected logger: ILogger,
    @inject(PgStorage) protected connectionProvider: PgStorage
  ) {
    this.schema = env.DB_SCHEMA
  }

  async getEra(eraId: number): Promise<IEra> {
    try {
      const { rows } = await this.connectionProvider.query({
        text: `SELECT * FROM ${this.schema}.eras WHERE "era" = $1::int`,
        values: [eraId]
      })

      return rows[0]
    } catch (err) {
      this.logger.error(`failed to get era by id ${eraId}, error: ${err}`)
      throw new Error(`cannot get era by id ${eraId}`)
    }
  }

  async getEraStakingDiff(eraId: number): Promise<any> {
    try {
      const { rows } = await this.connectionProvider.query({
        text: `select e.era as era, e.total_stake  - sum(v.total) as diff from ${this.schema}.eras e 
					join${this.schema}.validators v
					on v.era = e.era
					where e.era = $1::int
					group by e.era`,
        values: [eraId]
      })

      return rows[0]
    } catch (err) {
      this.logger.error(`failed to get staking diff by id ${eraId}, error: ${err}`)
      throw new Error(`failed to get staking diff by id ${eraId}`)
    }
  }
}
