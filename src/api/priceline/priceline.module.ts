import { Module } from '@nestjs/common';
import { PricelineController } from './priceline.controller';
import { PricelineService } from './priceline.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PricelineController],
  providers: [PricelineService],
  exports: [PricelineService],
})
export class PricelineModule {}
