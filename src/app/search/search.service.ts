import { Inject, Injectable } from '@nestjs/common';
import { ISearchInput } from '../../interfaces';
import { SearchTripService } from './trip/search-trip.service';

@Injectable()
export class SearchService {
  @Inject(SearchTripService)
  private readonly searchTripService: SearchTripService;

  async getSearch(params: ISearchInput) {
    const trips = await this.searchTripService.getTripsFromSearch(params);
    return JSON.stringify(trips);
  }
}
