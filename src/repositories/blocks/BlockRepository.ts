import { inject, injectable } from 'inversify'
import { ILogger } from '@modules/logger/ILogger'
import { IBlockData } from '@services/blocks/'
import { Environment } from '@modules/environment/Environment'
import { PgStorage } from '@modules/storage/PgStorage'
import { IBlock } from '../../services/watchdog/watchdog.types'
import { IBlockRepository } from './IBlockRepository'

@injectable()
export class BlockRepository implements IBlockRepository {
  public constructor(
    @inject(Environment) protected env: Environment,
    @inject(ILogger) protected logger: ILogger,
    @inject(PgStorage) protected connectionProvider: PgStorage
  ) {}

  async addNewBlock(blockData: IBlockData): Promise<void> {
    this.logger.info(`repository add new block ${blockData.block.header.number} with time ${blockData.block_time}`)
    try {
      const header = blockData.block.header
      const values = [
        header.number,
        header.hash,
        header.stateRoot,
        header.extrinsicsRoot,
        header.parentHash,
        header.author,
        header.session_id,
        header.era,
        header.currentEra,
        header.last_log,
        header.digest,
        Number(blockData.block_time)
      ]
      await this.connectionProvider.query({
        text: `INSERT INTO ${this.env.DB_SCHEMA}.blocks 
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, to_timestamp($12 / 1000))
          ON CONFLICT (id)
          DO UPDATE SET
            "hash" = $2,
            "state_root" = $3,
            "extrinsics_root" = $4,
            "parent_hash" = $5,
            "author" = $6,
            "session_id" = $7,
            "era" = $8,
            "current_era" = $9,
            "last_log" = $10,
            "digest" = $11,
            "block_time" = to_timestamp($12 / 1000)
            `,
        values
      })
    } catch (err) {
      this.logger.error(`Error insert block ${blockData.block.header.number}: ${err.message}`)
      throw new Error(`Error insert block ${blockData.block.header.number}: ${err.message}`)
    }
  }

  async isEmpty(): Promise<boolean> {
    try {
      const { rows } = await this.connectionProvider.query({
        text: `SELECT count (*) FROM ${this.env.DB_SCHEMA}.blocks`
      })
      const blocksInDBCount = +rows[0].count

      return blocksInDBCount === 0
    } catch (err) {
      this.logger.error(`Error check is db empty`)
      throw new Error('Error check is db empty')
    }
  }

  async getBlockById(blockId: number): Promise<any> {
    try {
      const { rows } = await this.connectionProvider.query({
        text: `SELECT * FROM ${this.env.DB_SCHEMA}.blocks WHERE "id" = $1::int`,
        values: [blockId]
      })

      return rows[0]
    } catch (err) {
      this.logger.error(`failed to get block by id ${blockId}, error: ${err}`)
      throw new Error('cannot getblock by id')
    }
  }

  async getLastProcessedBlock(): Promise<number> {
    let blockNumberFromDB = 0

    try {
      const queryText = `SELECT id AS last_number FROM ${this.env.DB_SCHEMA}.blocks ORDER BY id DESC LIMIT 1`
      const { rows } = await this.connectionProvider.query({ text: queryText })

      if (rows.length && rows[0].last_number) {
        blockNumberFromDB = parseInt(rows[0].last_number)
      }
    } catch (err) {
      this.logger.error({ err }, 'failed to get last synchronized block number')
      throw new Error('cannot get last block number')
    }

    return blockNumberFromDB
  }

  async getFirstBlockInEra(eraId: number): Promise<IBlock | null> {
    try {
      const { rows } = await this.connectionProvider.query({
        text: `SELECT * FROM ${this.env.DB_SCHEMA}.blocks WHERE "era" = $1::int order by "id" limit 1`,
        values: [eraId]
      })

      return rows[0]
    } catch (err) {
      this.logger.error({ err }, `failed to get first block of session`)
      throw new Error('cannot find first era block')
    }
  }

  async getFirstBlockInSession(sessionId: number): Promise<IBlock> {
    const { rows } = await this.connectionProvider.query({
      text: `SELECT * FROM ${this.env.DB_SCHEMA}.blocks WHERE "session_id" = $1::int order by "id" limit 1`,
      values: [sessionId]
    })

    return rows[0]
  }
}
