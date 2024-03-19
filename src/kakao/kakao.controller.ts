import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { KakaoService } from './kakao.service';
import { AuthService } from 'src/auth/auth.service';
import { KakaoCallbackModel } from './kakao.interface';

@Controller('kakao')
export class KakaoController {
    constructor(
        private readonly kakaoService: KakaoService,
        private readonly authService: AuthService,
    ) {}

    @Post('callback')
    @HttpCode(200)
    async kakaoCallback(@Body() body: KakaoCallbackModel) {
        if (body.action_name === 'generation') {
            const code = await this.kakaoService
                .getUser(body.react_user_id)
                .then((user) => this.authService.genCode(user));

            this.kakaoService.sendCode(body.react_user_id, code);
        } else if (body.action_name === 'open_admin_menu') {
            this.kakaoService.getUser(body.react_user_id).then((user) => {});
        }
    }
}
