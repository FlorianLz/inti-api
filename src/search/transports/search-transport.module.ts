import { Module } from '@nestjs/common';
import { SearchTransportService } from './search-transport.service';
import { SearchTransportController } from './search-transport.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SearchTransportController],
  providers: [SearchTransportService],
  exports: [SearchTransportService],
})
export class SearchTransportModule {}
