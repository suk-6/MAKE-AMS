import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DoorService } from 'src/door/door.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
        private readonly doorService: DoorService,
    ) {}

    async getPendings(code: string) {
        const admin = await this.authService.checkAdmin(code);
        if (!admin) throw new UnauthorizedException('Not Admin');

        const pendings = await this.prisma.user.findMany({
            where: {
                isApproved: false,
            },
        });

        return pendings.map((pending) => ({
            id: pending.id,
            name: pending.name,
            studentId: pending.studentId,
        }));
    }

    async approveUser(code: string, userId: string) {
        const admin = await this.authService.checkAdmin(code);
        if (!admin) throw new UnauthorizedException('Not Admin');

        const user = await this.authService.getUserById(userId);
        if (!user) throw new BadRequestException('Invalid User');

        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isApproved: true,
            },
        });

        return { status: true };
    }

    async rejectUser(code: string, userId: string) {
        const admin = await this.authService.checkAdmin(code);
        if (!admin) throw new UnauthorizedException('Not Admin');

        const user = await this.authService.getUserById(userId);
        if (!user) throw new BadRequestException('Invalid User');

        await this.prisma.user.delete({
            where: {
                id: userId,
            },
        });

        return { status: true };
    }

    async accessLogs(code: string) {
        if (!(await this.authService.checkAdmin(code))) {
            throw new UnauthorizedException(
                'You are not authorized to access this resource',
            );
        }
        const rawAccessLogs = await this.prisma.accessLog.findMany();

        return Promise.all(
            rawAccessLogs.map(async (log) => {
                const user = await this.prisma.user.findUnique({
                    where: {
                        id: log.userId,
                    },
                });

                return {
                    studentId: user.studentId,
                    name: user.name,
                    timestamp: log.createdAt,
                };
            }),
        );
    }

    async getDoorStatus() {
        return { status: await this.doorService.getDoorStatus() };
    }

    async lockDoor(code: string) {
        if (!(await this.authService.checkAdmin(code))) {
            throw new UnauthorizedException(
                'You are not authorized to access this resource',
            );
        }

        await this.doorService.lockDoor();
        return { status: true };
    }

    async unlockDoor(code: string) {
        if (!(await this.authService.checkAdmin(code))) {
            throw new UnauthorizedException(
                'You are not authorized to access this resource',
            );
        }

        await this.doorService.unlockDoor();
        return { status: true };
    }

    async restrictDoor(code: string) {
        if (!(await this.authService.checkAdmin(code))) {
            throw new UnauthorizedException(
                'You are not authorized to access this resource',
            );
        }

        await this.doorService.restrictDoor();
        return { status: true };
    }
}
