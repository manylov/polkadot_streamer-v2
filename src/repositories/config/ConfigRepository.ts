import { inject, injectable } from 'inversify'
import { ILogger } from '@modules/logger/ILogger'
import { IConfigRepository } from './IConfigRepository'
import { Environment } from '@modules/environment/Environment'
import { PgStorage } from '@modules/storage/PgStorage'

@injectable()
export class ConfigRepository implements IConfigRepository {
  private schema: string

  public constructor(
    @inject(Environment) protected env: Environment,
    @inject(ILogger) protected logger: ILogger,
    @inject(PgStorage) protected connectionProvider: PgStorage
  ) {
    this.schema = env.DB_SCHEMA
  }

  async update(key: string, value: string | number): Promise<void> {
    try {
      await this.connectionProvider.query({
        text: `UPDATE ${this.schema}._config SET "value" = $2 WHERE "key" = $1`,
        values: [key, value]
      })
    } catch (err) {
      this.logger.error({ err }, `failed to updateConfigValueInDB config `)
      throw new Error('cannot updateConfigValueInDB config value')
    }
  }

  async find(key: string): Promise<string | undefined> {
    this.logger.debug(`find by key ${key}`)
    try {
      const result = await this.connectionProvider.query({
        text: `SELECT "value" FROM ${this.schema}._config WHERE "key" = $1 LIMIT 1`,
        values: [key]
      })

      console.log({ result })
      return result.rows[0]?.value
    } catch (err) {
      this.logger.error({ err }, `failed to get config key`)
      throw new Error('cannot get config value')
    }
  }

  async insert(key: string, value: string | number): Promise<void> {
    try {
      await this.connectionProvider.query({
        text: `INSERT INTO  ${this.schema}._config VALUES ($1, $2)`,
        values: [key, value]
      })
    } catch (err) {
      this.logger.error({ err }, `failed to set config key`)
      throw new Error('cannot set config value')
    }
  }
}
