import { Injectable } from '@nestjs/common';
import { DoorStatus } from 'src/misc/doorStatus';

@Injectable()
export class DoorService {
    constructor() {}

    doorStatus = DoorStatus.UNLOCKED;

    async getDoorStatus() {
        return this.doorStatus;
    }

    async lockDoor() {
        this.doorStatus = DoorStatus.LOCKED;
        return this.doorStatus;
    }

    async unlockDoor() {
        this.doorStatus = DoorStatus.UNLOCKED;
        return this.doorStatus;
    }

    async restrictDoor() {
        this.doorStatus = DoorStatus.RESTRICTED;
        return this.doorStatus;
    }
}
