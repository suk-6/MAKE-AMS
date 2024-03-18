import { Injectable } from '@nestjs/common';
import { Prisma, accessCode } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CodeService {
    constructor(private readonly prisma: PrismaService) {}

    async generateAccessCode(
        data: Prisma.accessCodeCreateInput,
    ): Promise<accessCode> {
        return this.prisma.accessCode.create({ data });
    }

    async getAccessCode(
        where: Prisma.accessCodeWhereUniqueInput,
    ): Promise<accessCode | null> {
        return this.prisma.accessCode.findUnique({ where });
    }

    async expireAccessCode(
        where: Prisma.accessCodeWhereUniqueInput,
    ): Promise<accessCode> {
        return this.prisma.accessCode.update({
            where,
            data: { expired: true },
        });
    }
}

// import { randomUUID } from 'crypto';
// (() => {
//     const codeService = new CodeService(new PrismaService());
//     codeService
//         .generateAccessCode({
//             code: randomUUID(),
//             id: 'gildong',
//             name: '홍길동',
//         })
//         .then((res) => {
//             console.log(res);
//         });
// })();
