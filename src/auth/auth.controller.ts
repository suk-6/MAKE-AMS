import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, registerUserDto } from './auth.dto';

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
        const user = await this.authService.loginUser(
            loginDto.id,
            loginDto.password,
        );

        return this.authService.genCode(user);
    }

    @Post('register')
    async register(@Body() registerDto: registerUserDto) {
        return await this.authService.registerUser(registerDto);
    }

    @Get('admin')
    async checkAdmin(@Query('code') code: string) {
        if (!code) throw new BadRequestException('Code is required');
        return this.authService.checkAdmin(code);
    }
}
