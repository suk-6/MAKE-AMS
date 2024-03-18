import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { KakaoModule } from './kakao/kakao.module';
import { ConfigModule } from '@nestjs/config';
import { CodeModule } from './code/code.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        PrismaModule,
        KakaoModule,
        CodeModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
