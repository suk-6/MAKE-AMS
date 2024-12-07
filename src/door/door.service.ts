import { isHoliday } from '@hyunbinseo/holidays-kr';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { DoorStatus } from 'src/misc/doorStatus';
import { GrpcMethod } from '@nestjs/microservices';
import { DoorStatusRequest, DoorStatusResponse, DoorStatusResponse_Status } from '../proto/doorStatus.pb'; 

@Injectable()
export class DoorService {
    constructor() {}

    #doorStatus = DoorStatus.UNLOCKED;

    @GrpcMethod('DoorStatusService', 'GetDoorStatus') // gRPC 메소드 정의
    getDoorStatusRpc(_: DoorStatusRequest): DoorStatusResponse { 
        // DoorStatusRequest는 사용하지 않으므로 _로 처리
        let mode : DoorStatusResponse_Status;
        switch (this.#doorStatus) {
            case DoorStatus.LOCKED:
                mode = DoorStatusResponse_Status.LOCKED;
                break;
            case DoorStatus.UNLOCKED:
                mode = DoorStatusResponse_Status.UNLOCKED;
                break;
            case DoorStatus.RESTRICTED:
                mode = DoorStatusResponse_Status.RESTRICTED;
                break;
            default:
                mode = DoorStatusResponse_Status.UNRECOGNIZED;
        }

        return { mode };
    }

    // 월~수요일 15:30 실행
    @Cron('30 15 * * 1-3', { timeZone: 'Asia/Seoul' })
    async updateDoorStatusAtMonToWed() {
        const now = DateTime.now();
        if (isHoliday(now.toJSDate())) return;

        this.unlockDoor();
    }

    // 목~금요일 16:30 실행
    @Cron('30 16 * * 4-5', { timeZone: 'Asia/Seoul' })
    async updateDoorStatusAtThuToFri() {
        const now = DateTime.now();
        if (isHoliday(now.toJSDate())) return;

        this.unlockDoor();
    }

    async getDoorStatus() {
        return this.#doorStatus;
    }

    // 매일 0시에 출입 제한 모드로 전환
    @Cron('0 0 * * *', { timeZone: 'Asia/Seoul' })
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
