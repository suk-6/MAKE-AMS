import { hash, compare } from 'bcrypt';
import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModel } from './auth.models';
import { registerUserDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async accessByCode(code: string) {
        const userId = await this.verifyCode(code);
        if (!userId) throw new BadRequestException('Invalid code');
        const user = await this.getUserById(userId);
        if (!user) throw new UnauthorizedException('Invalid code');

        this.loggingUser(user, code);

        return true;
    }

    async registerUser(user: registerUserDto) {
        const hashed = await hash(user.password, 10);
        return this.prisma.user.create({
            data: {
                id: user.id,
                name: user.name,
                password: hashed,
                studentId: user.studentId,
            },
        });
    }

    async loginUser(id: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) throw new UnauthorizedException('Invalid ID');

        const isValid = await compare(password, user.password);
        if (!isValid) throw new UnauthorizedException('Invalid password');

        return user;
    }

    async getUserById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async verifyCode(code: string) {
        const accessCode = await this.prisma.accessCode.findUnique({
            where: {
                code,
                expired: false,
            },
        });

        if (accessCode.userId) return accessCode.userId;
        return null;
    }

    async loggingUser(user: UserModel, code: string) {
        this.prisma.accessLog
            .create({
                data: {
                    code,
                    userId: user.id,
                },
            })
            .then((res) => console.log('Access Log: ', res));
    }

    async genCode(user: UserModel) {
        const code = randomBytes(16).toString('hex');
        await this.expireBeforeCode(user);
        this.saveCode(user, code);

        return code;
    }

    async saveCode(user: UserModel, code: string) {
        this.prisma.accessCode
            .create({
                data: {
                    code,
                    userId: user.id,
                },
            })
            .then((res) => console.log('Created Code: ', res));
    }

    async expireBeforeCode(user: UserModel) {
        await this.prisma.accessCode
            .updateMany({
                where: {
                    userId: user.id,
                },
                data: {
                    expired: true,
                },
            })
            .then((res) => console.log('Expired Code: ', res));
    }
}
