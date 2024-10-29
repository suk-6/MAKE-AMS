import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('pendings')
    async getPendings(@Query('code') code: string) {
        return this.adminService.getPendings(code);
    }

    @Get('approve')
    async approveUser(
        @Query('code') code: string,
        @Query('id') userId: string,
    ) {
        return this.adminService.approveUser(code, userId);
    }

    @Get('reject')
    async rejectUser(@Query('code') code: string, @Query('id') userId: string) {
        return this.adminService.rejectUser(code, userId);
    }

    @Get('access-logs')
    async accessLogs(@Query('code') code: string) {
        return this.adminService.accessLogs(code);
    }

    @Get('door-status')
    async doorStatus() {
        return this.adminService.getDoorStatus();
    }

    @Get('lock')
    async lock(@Query('code') code: string) {
        return this.adminService.lockDoor(code);
    }

    @Get('unlock')
    async unlock(@Query('code') code: string) {
        return this.adminService.unlockDoor(code);
    }

    @Get('restrict')
    async restrict(@Query('code') code: string) {
        return this.adminService.restrictDoor(code);
    }

    @Get('code-list')
    async getCodeList(@Query('admin') adminCode: string) {
        const data = this.adminService.getCodeList(adminCode);
        console.log(data);
        return data;
    }
}
