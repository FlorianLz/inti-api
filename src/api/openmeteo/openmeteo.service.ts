import { Inject, Injectable } from '@nestjs/common';
import { ILocation } from '../../interfaces';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';

@Injectable()
export class OpenmeteoService {
  @Inject(HttpService)
  private readonly httpService: HttpService;
  async getElevationByCoordinates(params: ILocation): Promise<number> {
    const url = new URL(process.env.OPENMETEO_API_URL + '/elevation');
    url.searchParams.append('latitude', params.latitude.toString());
    url.searchParams.append('longitude', params.longitude.toString());
    try {
      const response = await this.httpService.get(url.toString()).toPromise();
      return response.data.elevation;
    } catch (error) {
      console.log(error);
    }
  }
}
