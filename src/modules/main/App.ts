import { inject, injectable, postConstruct } from 'inversify';
import { ILogger }                           from '../logger/ILogger';
import { Environment }                       from '../environment/Environment';
import { PgStorage }                         from '../storage/PgStorage';

@injectable()
export class App {
  public constructor(
    @inject(ILogger) protected logger: ILogger,
    @inject(Environment) protected env: Environment,
    @inject(PgStorage) protected pgStorage: PgStorage,
  ) {
  }

  @postConstruct()
  public async initialize() {
    this.logger.info('App initialized');
  }

  public async start() {
    this.logger.info('App started');
  }

  public async close() {
    this.logger.info(`Closing application`);
    await this.pgStorage.close();
  }

}
