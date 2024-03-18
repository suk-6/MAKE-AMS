import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { KakaoUserModel } from 'src/kakao/kakao.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async accessByCode(code: string) {
        const user = await this.verifyCode(code);
        if (!user) throw new BadRequestException('Invalid code');

        this.loggingUser(user.id, user.name, code);

        return true;
    }

    async verifyCode(code: string) {
        const user = await this.prisma.accessCode.findUnique({
            where: {
                code,
                expired: false,
            },
        });

        if (user) return user;
        return null;
    }

    async loggingUser(id: string, name: string, code: string) {
        this.prisma.accessLog
            .create({
                data: {
                    code,
                    id,
                    name,
                },
            })
            .then((res) => console.log('Access Log: ', res));
    }

    async genCode(user: KakaoUserModel) {
        const code = randomBytes(16).toString('hex');
        await this.expireBeforeCode(user);
        this.saveCode(user, code);

        return code;
    }

    async saveCode(user: KakaoUserModel, code: string) {
        this.prisma.accessCode
            .create({
                data: {
                    code,
                    id: user.id,
                    name: user.display_name,
                },
            })
            .then((res) => console.log('Created Code: ', res));
    }

    async expireBeforeCode(user: KakaoUserModel) {
        await this.prisma.accessCode
            .updateMany({
                where: {
                    id: user.id,
                },
                data: {
                    expired: true,
                },
            })
            .then((res) => console.log('Expired Code: ', res));
    }
}
