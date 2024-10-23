import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }))
  const config = new DocumentBuilder()
    .setTitle('EM-Backend')
    .setDescription('The em-backend app apis')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Auth')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
