import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { KakaoService } from './kakao.service';

@Controller('kakao')
export class KakaoController {
    constructor(private readonly kakaoService: KakaoService) {}

    @Post('callback')
    @HttpCode(200)
    async kakaoCallback(@Body() body: any) {
        this.kakaoService
            .getUser(body.react_user_id)
            .then((user) => console.log(user));

        return;
    }
}
