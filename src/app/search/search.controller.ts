import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import { jsonData } from '../../data/mock/data-country.mock';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search')
  async getSearch() {
    return await this.searchService.getSearch(jsonData);
  }
}
