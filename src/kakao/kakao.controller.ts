import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Post,
} from '@nestjs/common';
import { KakaoService } from './kakao.service';
import { AuthService } from 'src/auth/auth.service';
import { KakaoCallbackModel, KakaoModalModel } from './kakao.interface';

@Controller('kakao')
export class KakaoController {
    constructor(
        private readonly kakaoService: KakaoService,
        private readonly authService: AuthService,
    ) {}

    @Post('modal')
    @HttpCode(200)
    async kakaoModal(@Body() body: KakaoModalModel) {
        if (!(body.type === 'request_modal'))
            throw new BadRequestException('Invalid type');
        if (body.value === 'qr_management')
            return this.kakaoService.resQRManagementModal();
    }

    @Post('callback')
    @HttpCode(200)
    async kakaoCallback(@Body() body: KakaoCallbackModel) {
        if (body.type === 'submit_action') {
            if (body.action_name === 'generation') {
                const code = await this.kakaoService
                    .getUser(body.react_user_id)
                    .then((user) => this.authService.genCode(user));

                this.kakaoService.sendCode(body.react_user_id, code);
            } else if (body.action_name === 'open_admin_menu') {
                this.kakaoService.getUser(body.react_user_id).then((user) => {
                    const id = parseInt(user.id);
                    if (
                        user.position === '선생님' ||
                        user.position === '관리자'
                    )
                        this.kakaoService.sendAdminMenu(id);
                });
            }
        } else if (body.type === 'submission') {
        }
    }
}
