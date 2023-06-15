import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Module } from '@nestjs/common';
import { SearchTripModule } from './trip/search-trip.module';

@Module({
  imports: [SearchTripModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
