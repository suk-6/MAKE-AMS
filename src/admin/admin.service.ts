import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
    ) {}

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
                    accessTime: log.createdAt.getTime(),
                };
            }),
        );
    }
}
