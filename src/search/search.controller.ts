import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import { jsonData } from './mock/data.mock';
import { amadeus } from '../amadeus/init';
import { ISearchInput } from "../interfaces";

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search')
  getSearch() {
    return this.searchService.getSearch(jsonData);
  }
}
