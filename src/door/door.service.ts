import { isHoliday } from '@hyunbinseo/holidays-kr';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { DoorStatus } from 'src/misc/doorStatus';

@Injectable()
export class DoorService {
    constructor() {}

    #doorStatus = DoorStatus.UNLOCKED;

    @Cron('0,30 * * * *')
    async updateDoorStatus() {
        const now = DateTime.now();
        const weekday = now.weekday;
        const hour = now.hour;
        const minute = now.minute;

        // 공휴일, 주말 - QR 코드로만 출입 가능
        if (isHoliday(now.toJSDate()) || weekday === 6 || weekday === 7) {
            this.restrictDoor();
            return;
        }

        // 23시 이후, 7시 이전 - 출입 불가
        if (hour < 7 || hour >= 23) {
            this.lockDoor();
            return;
        }

        // 월~수요일 15:30 이후 - 자율 출입 가능
        if (weekday <= 3 && hour >= 15 && minute >= 30) {
            this.unlockDoor();
            return;
        }

        // 목~금요일 16:30 이후 - 자율 출입 가능
        if (weekday >= 4 && hour >= 16 && minute >= 30) {
            this.unlockDoor();
            return;
        }

        // 그 외 - QR 코드로만 출입 가능
        this.restrictDoor();
    }

    async getDoorStatus() {
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

    async restrictDoor() {
        this.#doorStatus = DoorStatus.RESTRICTED;
        return this.#doorStatus;
    }
}
