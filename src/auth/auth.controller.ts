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
    async access(@Query('code') code: string | null) {
        console.log('🚀 ~ AuthController ~ access ~ code:', code);
        if (!code) return this.authService.access();
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

    @Get('check')
    async check(@Query('code') code: string) {
        if (!code) throw new BadRequestException('Code is required');
        return this.authService.checkCode(code);
    }

    @Get('regenerate')
    async regenerate(@Query('code') code: string) {
        if (!code) throw new BadRequestException('Code is required');
        return this.authService.regenerateCode(code);
    }

    @Get('setadmin')
    async setAdmin(@Query('id') id: string, @Query('code') code: string) {
        if (!code) throw new BadRequestException('Code is required');
        return this.authService.updateAdmin(id, code);
    }

    @Get('recent')
    async recentAccess(@Query('code') code: string) {
        if (!code) throw new BadRequestException('Code is required');
        return this.authService.recentAccess(code);
    }
}
