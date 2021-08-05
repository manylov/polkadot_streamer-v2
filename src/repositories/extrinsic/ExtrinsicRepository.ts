import { IExtrinsicRepository } from './IExtrinsicRepository'
import { IExtrinsic } from '@services/extrinsics'
import { inject, injectable } from 'inversify'
import { Environment } from '@modules/environment/Environment'
import { PgStorage } from '@modules/storage/PgStorage'
import { ILogger } from '@modules/logger/ILogger'

@injectable()
export class ExtrinsicRepository implements IExtrinsicRepository {
  private schema: string

  constructor(
    @inject(Environment) protected env: Environment,
    @inject(ILogger) protected logger: ILogger,
    @inject(PgStorage) protected connectionProvider: PgStorage
  ) {
    this.schema = env.DB_SCHEMA
  }

  async getExtrinsicsCountByBlock(blockId: number): Promise<number> {
    const {
      rows: [{ count }]
    } = await this.connectionProvider.query({
      text: `SELECT count(*) FROM ${this.schema}.events WHERE "block_id" = $1::int`,
      values: [blockId]
    })

    return +count
  }

  async saveExtrinsics(extrinsics: IExtrinsic[]): Promise<void> {
    this.logger.info(`repository save extrinsics of block ${extrinsics[0]?.block_id}`)
    for (const extrinsic of extrinsics) {
      try {
        const values = [
          extrinsic.id,
          extrinsic.block_id,
          extrinsic.parent_id,
          extrinsic.session_id,
          extrinsic.era,
          extrinsic.section,
          extrinsic.method,
          extrinsic.mortal_period,
          extrinsic.mortal_phase,
          extrinsic.is_signed,
          extrinsic.signer,
          extrinsic.tip,
          extrinsic.nonce,
          extrinsic.ref_event_ids,
          extrinsic.version,
          JSON.stringify(extrinsic.extrinsic),
          JSON.stringify(extrinsic.args)
        ]
        await this.connectionProvider.query({
          text: `INSERT INTO ${this.schema}.extrinsics 
                  values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb,$17::jsonb)
                `,
          values
        })
        process.exit(1)
      } catch (err) {
        this.logger.error(`Error insert extrinsic ${extrinsic.id} of block ${extrinsic.block_id}: ${err.message} `)
        throw new Error(`Error insert extrinsic ${extrinsic.id} of block ${extrinsic.block_id}: ${err.message}`)
      }
    }
  }
}
