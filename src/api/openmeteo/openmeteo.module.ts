import { Module } from '@nestjs/common';
import { OpenmeteoController } from './openmeteo.controller';
import { OpenmeteoService } from './openmeteo.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [OpenmeteoController],
  providers: [OpenmeteoService],
  exports: [OpenmeteoService],
})
export class OpenmeteoModule {}
