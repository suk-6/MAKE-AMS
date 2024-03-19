import { Module } from '@nestjs/common';
import { KakaoController } from './kakao.controller';
import { KakaoService } from './kakao.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [KakaoController],
    providers: [KakaoService],
    exports: [KakaoService],
})
export class KakaoModule {}
