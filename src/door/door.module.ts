import { Global, Module } from '@nestjs/common';
import { DoorService } from './door.service';

@Global()
@Module({
    providers: [DoorService],
    exports: [DoorService],
})
export class DoorModule {}
