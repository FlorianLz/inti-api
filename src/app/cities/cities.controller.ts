import { Controller, Get } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller()
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get('cities')
  async getSearch() {
    return await this.citiesService.mutateCities();
  }
}
