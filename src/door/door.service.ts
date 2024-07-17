import { isHoliday } from '@hyunbinseo/holidays-kr';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { DoorStatus } from 'src/misc/doorStatus';

@Injectable()
export class DoorService {
    constructor() {}

    #doorStatus = DoorStatus.UNLOCKED;

    // 월~수요일 15:30 실행
    @Cron('30 15 * * 1-3')
    async updateDoorStatusAtMonToWed() {
        const now = DateTime.now();
        if (isHoliday(now.toJSDate())) return;

        this.unlockDoor();
    }

    // 목~금요일 16:30 실행
    @Cron('30 16 * * 4-5')
    async updateDoorStatusAtThuToFri() {
        const now = DateTime.now();
        if (isHoliday(now.toJSDate())) return;

        this.unlockDoor();
    }

    async getDoorStatus() {
        return this.#doorStatus;
    }

    // 매일 0시에 QR 모드로 전환
    @Cron('0 0 * * *')
    async restrictDoor() {
        this.#doorStatus = DoorStatus.RESTRICTED;
        return this.#doorStatus;
    }

    async lockDoor() {
        this.#doorStatus = DoorStatus.LOCKED;
        return this.#doorStatus;
    }

    async unlockDoor() {
        this.#doorStatus = DoorStatus.UNLOCKED;
        return this.#doorStatus;
    }
}
