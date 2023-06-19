import { Inject, Injectable } from '@nestjs/common';
import { SupabaseService } from '../../api/supabase/supabase.service';
import { OpenmeteoService } from '../../api/openmeteo/openmeteo.service';
import { ILocation } from '../../interfaces';

@Injectable()
export class CitiesService {
  @Inject(SupabaseService)
  private readonly supabaseService: SupabaseService;
  @Inject(OpenmeteoService)
  private readonly openmeteoService: OpenmeteoService;

  async mutateCitiesOld() {
    const { data } = await this.supabaseService
      .getClient()
      .from('cities')
      .select('*')
      .eq('landscape', 'beach');

    for (const [index, city] of data.entries()) {
      const elevation = await this.openmeteoService.getElevationByCoordinates({
        longitude: city.longitude,
        latitude: city.latitude,
      });

      if (elevation > 50) {
        console.log(`${index}/${data.length}`);
        console.log(city.name, elevation);
        await this.supabaseService
          .getClient()
          .from('cities')
          .update({ landscape: 'flat' })
          .match({ id: city.id });
      }
    }
  }
  async mutateCities() {
    const { data } = await this.supabaseService
      .getClient()
      .from('cities')
      .select('*')
      .range(2000, 3000);

    for (const [index, city] of data.entries()) {
      const elevation = await this.openmeteoService.getElevationByCoordinates({
        longitude: city.longitude,
        latitude: city.latitude,
      });

      const nearestBeach = await this.getNearestBeachInfo({
        longitude: city.longitude,
        latitude: city.latitude,
      });

      const landscape =
        elevation > 800
          ? 'mountain'
          : nearestBeach && elevation < 50
          ? 'beach'
          : 'flat';

      if (landscape !== city.landscape) {
        console.log(`${index}/${data.length}`);
        await this.supabaseService
          .getClient()
          .from('cities')
          .update({ landscape: landscape })
          .match({ id: city.id });
      }
    }
  }

  async getNearestBeachInfo(params: ILocation) {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const overpassQuery = `
    [out:json];
    (
      node(around:30000,${params.latitude},${params.longitude})[natural=beach];
      way(around:30000,${params.latitude},${params.longitude})[natural=beach];
    );
    out;
  `;

    const options = {
      method: 'POST',
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      body: overpassQuery,
    };

    try {
      const response = await fetch(overpassUrl, options);
      const data = await response.json();
      if (data.elements.length > 0) {
        let nearestBeach = null;

        for (const element of data.elements) {
          if (element.tags && element.tags.name) {
            const isNatural = element.tags.natural === 'beach';
            const isSand = element.tags.surface === 'sand';
            if (isNatural && isSand) {
              nearestBeach = element;
              break;
            }
          }
        }
        return nearestBeach;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
