import { Module } from '@nestjs/common';
import { OpencageController } from './opencage.controller';
import { OpencageService } from './opencage.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [OpencageController],
  providers: [OpencageService],
  exports: [OpencageService],
})
export class OpencageModule {}
