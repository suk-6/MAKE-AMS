import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('access')
    async access(@Query('code') code: string) {
        if (!code) throw new BadRequestException('Code is required');
        return this.authService.accessByCode(code);
    }
}
