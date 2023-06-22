import {Body, Controller, Get, Post} from '@nestjs/common';
import { SearchService } from './search.service';
import { jsonData } from '../../data/mock/data.mock';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('search')
  async getSearch(@Body() jsonData: any) {
    const searchInput = jsonData.data;
    return await this.searchService.getSearch(searchInput);
  }
}
