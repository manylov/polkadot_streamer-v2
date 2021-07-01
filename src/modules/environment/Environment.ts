import appRoot                       from 'app-root-path';
import { injectable, postConstruct } from 'inversify';
import {
  plainToClass,
  Transform
}                                    from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPort,
  IsString,
  Min,
  MinLength,
  validateOrReject
}                                    from 'class-validator';
import { container }                 from '../../container';
import { ILogger }                   from '../logger/ILogger';
import dotenv                        from 'dotenv';
import { resolve }                   from 'path';

dotenv.config({path: resolve(appRoot.path, '.env'), debug: true});

@injectable()
export class Environment {

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  public DB_HOST!: string;

  @IsString()
  @MinLength(3)
  public DB_USER!: string;

  @IsString()
  @MinLength(3)
  public DB_PASSWORD!: string;

  @IsNotEmpty()
  @MinLength(2)
  public DB_NAME!: string;

  @IsPort()
  public DB_PORT: string = '5432';

  @IsString()
  public LOG_LEVEL: string = 'info';

  @IsNumber()
  @Min(5 * 60)
  @Transform(({value}) => parseInt(value, 10), {toClassOnly: true})
  public DB_DUMMY_WRITE_INTERVAL_SECONDS: number = 30 * 60;

  public static create() {
    return plainToClass(this, process.env);
  }

  @postConstruct()
  public async initialize() {
    try {
      await validateOrReject(this, {validationError: {target: false, value: false}});
    } catch (validationErrors) {
      const logger = container.get(ILogger);
      validationErrors
        .forEach((error: object) => logger.fatal(`Bad environment variable(s): %o`, error));
      process.exit(1);
    }
  }
}
