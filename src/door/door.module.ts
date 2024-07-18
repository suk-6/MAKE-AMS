import { Global, Module } from '@nestjs/common';
import { DoorService } from './door.service';
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [DoorService],
    exports: [DoorService],
})
export class DoorModule {}
