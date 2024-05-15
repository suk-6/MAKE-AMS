import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('access-logs')
    async accessLogs(@Query('code') code: string) {
        return this.adminService.accessLogs(code);
    }
}
