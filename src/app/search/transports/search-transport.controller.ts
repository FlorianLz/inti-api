import { Controller, Get } from '@nestjs/common';
import { SearchTransportService } from './search-transport.service';

@Controller()
export class SearchTransportController {
  constructor(
    private readonly searchTransportService: SearchTransportService,
  ) {}
}
