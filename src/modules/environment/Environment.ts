import appRoot from 'app-root-path'
import { injectable, postConstruct } from 'inversify'
import { plainToClass } from 'class-transformer'
import { IsNotEmpty, IsPort, IsString, MinLength, validateOrReject } from 'class-validator'
import { container } from '../../container'
import { ILogger } from '../logger/ILogger'
import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(appRoot.path, '.env'), debug: true })

@injectable()
export class Environment {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  public DB_HOST!: string

  @IsString()
  @MinLength(3)
  public DB_USER!: string

  @IsString()
  @MinLength(3)
  public DB_PASSWORD!: string

  @IsNotEmpty()
  @MinLength(2)
  public DB_NAME!: string

  @IsPort()
  public DB_PORT = '5432'

  @IsString()
  public LOG_LEVEL = 'info'

  @IsNotEmpty()
  SUBSTRATE_URI!: string

  @IsString()
  DB_SCHEMA = 'dot_polka'

  public static create(): Environment {
    return plainToClass(this, process.env)
  }

  @postConstruct()
  public async initialize(): Promise<void> {
    try {
      await validateOrReject(this, { validationError: { target: false, value: false } })
    } catch (validationErrors) {
      const logger = container.get(ILogger)
      validationErrors.forEach((error: Record<string, unknown>) =>
        logger.fatal(`Bad environment variable(s): %o`, error)
      )
      process.exit(1)
    }
  }
}
