import { Inject, Injectable } from '@nestjs/common';
import { ISearchInput } from '../../interfaces';
import { SearchTripService } from './trip/search-trip.service';
import { SearchTransportService } from './transports/search-transport.service';

@Injectable()
export class SearchService {
  @Inject(SearchTripService)
  private readonly searchTripService: SearchTripService;
  @Inject(SearchTransportService)
  private readonly searchTransportService: SearchTransportService;

  async getSearch(params: ISearchInput) {
    params.departureAirport =
      await this.searchTransportService.getNearestAirport(params.departure);
    const trips = await this.searchTripService.getTripsFromSearch(params);
    return JSON.stringify(trips);
  }
}
