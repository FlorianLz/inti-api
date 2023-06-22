import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';
import { IPricelineParams } from '../../interfaces/priceline.interfaces';

@Injectable()
export class PricelineService {
  @Inject(HttpService)
  private readonly httpService: HttpService;
  async getSearchExpressResults(params: IPricelineParams) {
    const data = await this.httpService
      .request({
        method: 'GET',
        url: process.env.PRICELINE_API_URL,
        params: {
          ...params,
        },
        headers: {
          'X-RapidAPI-Key': process.env.PRICELINE_API_KEY,
          'X-RapidAPI-Host': process.env.PRICELINE_API_HOST,
        },
      })
      .toPromise();
    return data.data;
  }
}
