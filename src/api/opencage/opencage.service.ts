import { Inject, Injectable } from '@nestjs/common';
import { ILocation } from '../../interfaces';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';

@Injectable()
export class OpencageService {
  @Inject(HttpService)
  private readonly httpService: HttpService;
  async getReverseGeocoding(params: ILocation) {
    const url = new URL(process.env.OPENCAGE_API_URL);
    url.searchParams.append('q', `${params.latitude}+${params.longitude}`);
    url.searchParams.append('key', process.env.OPENCAGE_API_KEY);
    return await this.httpService.get(url.toString()).toPromise();
  }

  async getForwardGeocoding(city: string) {
    const url = new URL(process.env.OPENCAGE_API_URL);
    url.searchParams.append('q', 'bordeaux');
    url.searchParams.append('key', process.env.OPENCAGE_API_KEY);
    return await this.httpService.get(url.toString()).toPromise();
  }
}
