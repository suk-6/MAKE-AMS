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
        const userId = await this.getUserIdByCode(code);
        if (!userId) throw new BadRequestException('Invalid code');
        const user = await this.getUserById(userId);
        if (!user) throw new UnauthorizedException('Invalid code');

        this.loggingUser(user, code);

        return true;
    }

    async registerUser(user: registerUserDto) {
        if (!user.id || !user.password || !user.name || !user.studentId)
            throw new BadRequestException('Invalid data');

        if (await this.getUserById(user.id)) {
            throw new BadRequestException('이미 회원가입 된 유저입니다.');
        }

        const hashed = await hash(user.password, 10);
        const result = await this.prisma.user.create({
            data: {
                id: user.id,
                name: user.name,
                password: hashed,
                studentId: user.studentId,
            },
        });

        if (!result) throw new BadRequestException('회원가입 실패');
        return { status: true };
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

        const isApproved = user.isApproved;
        if (!isApproved)
            throw new UnauthorizedException('관리자의 승인이 필요합니다.');

        const result: UserModel = {
            id: user.id,
            name: user.name,
            studentId: user.studentId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return result;
    }

    async getUserById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async getUserIdByCode(code: string) {
        const accessCode = await this.prisma.accessCode.findUnique({
            where: {
                code,
                expired: false,
            },
        });

        if (accessCode === null) return null;
        return accessCode.userId;
    }

    async checkAdmin(code: string) {
        const userId = await this.getUserIdByCode(code);
        if (!userId) throw new BadRequestException('Invalid code');
        const user = await this.getUserById(userId);
        if (!user) throw new UnauthorizedException('Invalid code');

        if (user.isAdmin === true) {
            return { status: true };
        }

        return { status: false };
    }

    async approveUser(code: string, userId: string) {
        const admin = await this.checkAdmin(code);
        if (!admin) throw new UnauthorizedException('Not Admin');

        const user = await this.getUserById(userId);
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
        const code = randomBytes(32).toString('hex');
        await this.expireBeforeCode(user);
        this.saveCode(user, code);

        return { status: true, code };
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
