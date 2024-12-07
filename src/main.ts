import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // HTTP 서버 생성

  app.enableCors({ // CORS 설정 유지
    origin: ['https://ams.make.dyhs.kr'],
    credentials: true,
  });

  // gRPC 서버 생성 및 설정
  const grpcServer = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'doorStatus', // .proto 파일의 package 이름
      protoPath: join(__dirname, 'doorStatus.proto'), // .proto 파일 경로
    },
  });

  await app.startAllMicroservices(); // gRPC 서버 시작
  await app.listen(3001); // HTTP 서버 시작
}
bootstrap();