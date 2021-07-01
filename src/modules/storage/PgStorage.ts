import pgPromise, { ColumnSet, IConnected, IDatabase, IMain } from 'pg-promise';
import { inject, injectable, postConstruct }                  from 'inversify';
import { Environment }                                        from '../environment/Environment';
import { ILogger }                                            from '../logger/ILogger';
import { IClient }                                            from 'pg-promise/typescript/pg-subset';

@injectable()
export class PgStorage {

  private readonly pgp: IMain;
  private readonly db: IDatabase<any>;
  private connection: IConnected<any, IClient> | undefined;

  public constructor(
    @inject(Environment) protected environment: Environment,
    @inject(ILogger) protected logger: ILogger,
  ) {
    this.pgp = pgPromise({
      capSQL: true,
    });

    this.db = this.pgp({
      host: this.environment.DB_HOST,
      user: this.environment.DB_USER,
      database: this.environment.DB_NAME,
      password: this.environment.DB_PASSWORD,
      port: parseInt(this.environment.DB_PORT, 10),
    });
  }

  @postConstruct()
  public async initialize() {
    this.connection = await this.db.connect();
  }

  public async close() {
    this.logger.info(`Closing DB connection`);
    await this.connection!.done();
  }
}
