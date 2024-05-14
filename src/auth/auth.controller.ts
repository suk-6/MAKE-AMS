import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('access')
    async access(@Query('code') code: string) {
        if (!code) throw new BadRequestException('Code is required');
        return this.authService.accessByCode(code);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        console.log(loginDto);
        return JSON.stringify(loginDto);
    }
}
