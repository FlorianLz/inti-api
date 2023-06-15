import { Controller, Get } from '@nestjs/common';
import { SearchBookingService } from './search-booking.service';

@Controller()
export class SearchBookingController {
  constructor(
    private readonly searchTransportService: SearchBookingService,
  ) {}
}
