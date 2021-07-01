import 'reflect-metadata';
import { Container }   from 'inversify';
import { Environment } from './modules/environment/Environment';
import { Logger }      from './modules/logger/Logger';
import { ILogger }     from './modules/logger/ILogger';
import { PgStorage }   from './modules/storage/PgStorage';
import { App }         from './modules/main/App';

export const container = new Container();

container.bind(ILogger).to(Logger).inSingletonScope();

container.bind(Environment)
  .toDynamicValue(async (context) => {
    const env = Environment.create();
    await env.initialize();
    return env;
  })
  .inSingletonScope()
  .onActivation((context, env) => {
    context.container.get(ILogger).setLevel(env.LOG_LEVEL);
    return env;
  });

container.bind(PgStorage).toSelf().inSingletonScope();
container.bind(App).toSelf().inSingletonScope();


