import { createClient } from '@supabase/supabase-js';
import { Injectable } from '@nestjs/common';
import { ISearchInput } from '../interfaces';
import { SearchService } from '../search/search.service';

@Injectable()
export class SupabaseService {
  private supabaseUrl = 'https://scksfmmylkkaqkckvvek.supabase.co';
  private supabaseKey = process.env.SUPABASE_KEY;
  private supabase = createClient(this.supabaseUrl, this.supabaseKey);

  public cities: any[];
  constructor(private searchService: SearchService) {}

  getSupabase() {
    return this.supabase;
  }

  async getCitiesByCountry(country: any) {
    //Get aall cities by country with supabase
    const { data, error } = await this.supabase
      .from('cities')
      .select('*')
      .eq('countryName', country);
    //console.log(data);

    const tabFinal = [];

    for (const city of data) {
      //console.log(city.name);
      const params: ISearchInput = {
        nbPerson: {
          adults: 4,
          children: 0,
          babies: 0,
        },
        transport: {
          train: false,
          car: true,
          plane: true,
          bus: false,
          boat: false,
          other: false,
        },
        budget: {
          min: 0,
          max: 1000,
        },
        destination: {
          city: city.name,
          countryCode: city.countryCode,
        },
        date: {
          startDate: '2023-06-20',
          endDate: '2023-06-27',
          nbDays: 8,
          isFlexible: false,
        },
        handicap: false,
        mood: 8,
        locationType: {
          hotel: true,
          apartment: false,
          camping: false,
          other: false,
        },
        formuleType: {
          allInclusive: true,
          halfBoard: false,
          fullBoard: false,
          breakfast: false,
          nothing: false,
        },
        landscape: {
          sea: true,
        },
        nearFromCity: false,
      };
      const infos = await this.searchService.getSearch(params);
      tabFinal.push(infos);
    }

    const tabFinal2 = [];
    for (const tab of tabFinal) {
      for (const info of tab) {
        tabFinal2.push(info);
      }
    }
    //const infos = await this.searchService.getSearch(params);
    //console.log(infos);
    return JSON.stringify(tabFinal2);
  }
}
