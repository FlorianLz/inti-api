import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Module } from '@nestjs/common';
import { SearchTripModule } from './trip/search-trip.module';
import { SearchTransportModule } from './transports/search-transport.module';

@Module({
  imports: [SearchTripModule, SearchTransportModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
