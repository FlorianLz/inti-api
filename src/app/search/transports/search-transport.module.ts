import { Module } from '@nestjs/common';
import { SearchTransportService } from './search-transport.service';
import { SearchTransportController } from './search-transport.controller';
import { AmadeusModule } from '../../../api/amadeus/amadeus.module';

@Module({
  imports: [AmadeusModule],
  controllers: [SearchTransportController],
  providers: [SearchTransportService],
  exports: [SearchTransportService],
})
export class SearchTransportModule {}
