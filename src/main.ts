import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'

const APPLICATION_PORT = 3000

void (async () => {
  const app = await NestFactory.create(AppModule)
  await app.listen(APPLICATION_PORT)
})()
  .then(() => {
    Logger.log(`Application is running on port ${APPLICATION_PORT} 🚀`, AppModule.name)
  })
  .catch((e) => {
    Logger.error(`An error has occurred while starting the application 💥`, AppModule.name)
    Logger.error(e, AppModule.name)
  })
