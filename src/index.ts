import 'reflect-metadata'
import { container } from './container'
import { App } from './modules/main/App'
import { ILogger } from './modules/logger/ILogger'
;(async () => {
  const logger = container.get<ILogger>(ILogger)

  try {
    const app = await container.getAsync(App)

    process.on('SIGINT', () => {
      logger.info('SIGINT')
      app.close()
      process.exit(1)
    })

    process.on('SIGTERM', () => {
      logger.info('SIGTERM')
      app.close()
      process.exit(1)
    })

    await app.start()
  } catch (err) {
    logger.fatal(err.message, err)
    process.exit(1)
  }
})()
