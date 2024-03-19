import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor() {}

    async index() {
        return 'MAKE; Access Management System';
    }
}
