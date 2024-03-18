import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeService } from './code/code.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AppController],
    providers: [AppService, CodeService],
})
export class AppModule {}
