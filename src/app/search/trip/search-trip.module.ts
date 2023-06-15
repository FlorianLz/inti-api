import { Module } from '@nestjs/common';
import { SearchTripService } from './search-trip.service';
import { SearchTripController } from './search-trip.controller';
import { SearchTransportModule } from '../transports/search-transport.module';
import { SearchBookingModule } from '../booking/search-booking.module';

@Module({
  imports: [SearchTransportModule, SearchBookingModule],
  controllers: [SearchTripController],
  providers: [SearchTripService],
  exports: [SearchTripService],
})
export class SearchTripModule {}
