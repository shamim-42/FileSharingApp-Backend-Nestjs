import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

import { config } from 'aws-sdk';

async function bootstrap() {
  const logger = new Logger('boostrapp');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());

  // We need to increase the url lize limit so that we can take a large string (public key here) in the url.
  // I am also keeping the code of post method body data size increasing code as well here so that can be
  // used later if needed. (Be aware that to serve this purpose we need the ExpressAdapter() instance inside the
  // NestFactory.create() function that already has been applied in the above line)
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  // app.use(bodyParser.json({ limit: '10mb' }));


  const port = process.env.PROT || 3000;
  app.enableCors();


  config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS,
    // region: ,
  });

  await app.listen(port).then(() => {
    logger.log(`server listenning on port ${port}`);
  });
}
bootstrap();
