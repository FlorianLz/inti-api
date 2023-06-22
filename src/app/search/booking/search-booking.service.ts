import { Inject, Injectable } from '@nestjs/common';
import { AmadeusService } from '../../../api/amadeus/amadeus.service';
import { ILocation, ISearchInput } from '../../../interfaces';
import { SupabaseService } from '../../../api/supabase/supabase.service';
import { IBooking } from '../../../interfaces/booking.interfaces';
import { HttpService } from '@nestjs/axios';
import { OpencageService } from '../../../api/opencage/opencage.service';
import { PricelineService } from '../../../api/priceline/priceline.service';

@Injectable()
export class SearchBookingService {
  @Inject(AmadeusService)
  private readonly amadeusService: AmadeusService;
  @Inject(SupabaseService)
  private readonly supabaseService: SupabaseService;
  @Inject(HttpService)
  private readonly httpService: HttpService;
  @Inject(OpencageService)
  private readonly opencageService: OpencageService;
  @Inject(PricelineService)
  private readonly pricelineService: PricelineService;

  async getBookings(params: ISearchInput) {
    if (!params.destination.city) {
      return await this.getBookingByCountry(params);
    }
    return await this.getBookingByCity(params);
  }

  async getCityGeocode(city: string, countryCode: string): Promise<ILocation> {
    try {
      const response = await this.opencageService.getForwardGeocoding(
        `${city},${countryCode}`,
      );
      return {
        longitude: response.data.results[0].geometry.lng,
        latitude: response.data.results[0].geometry.lat,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getBookingByCity(params: ISearchInput): Promise<IBooking[]> {
    const geoCode = await this.getCityGeocode(
      params.destination.city,
      params.destination.countryCode,
    );
    return await this.getBookingByGeocode(params, geoCode);
  }

  async getBookingByCountry(params: ISearchInput) {
    const cities = await this.getCitiesByCountry(params.destination.country);

    const tabFinal = [];

    for (const city of cities) {
      const cityBookings = await this.getBookingByGeocode(params, {
        longitude: city.longitude,
        latitude: city.latitude,
      });
      tabFinal.push(cityBookings);
    }

    const tabFinal2 = [];
    for (const tab of tabFinal) {
      if (tab && tab.length > 0) {
        for (const info of tab) {
          tabFinal2.push(info);
        }
      }
    }

    return tabFinal2;
  }

  async getBookingByGeocode(
    params: ISearchInput,
    geoCode: ILocation,
  ): Promise<IBooking[]> {
    const { cityName, countryName } =
      await this.getCityNameAndCountryNameByGeocode(geoCode);
    let hasAllRequiredAmenities = true;
    const requiredAmenities = this.getAmenitiesArrayFromSearchInput(params);
    const paramsa = {
      latitude: geoCode.latitude,
      longitude: geoCode.longitude,
      check_in: params.date.startDate,
      check_out: params.date.endDate,
      limit: '100',
      language: 'fr-FR',
      output_version: '3',
      sid: 'iSiX639',
    };
    const data = await this.pricelineService.getSearchExpressResults(paramsa);
    console.log(paramsa);
    const hotels = data['getHotelExpress.Results'].results.hotel_data;
    const hotelKeys = Object.keys(hotels);
    const hotelsArray = [];

    hotelKeys.forEach((key) => {
      const hotel = hotels[key];
      const amenitiesKeys = Object.keys(hotel.amenity_data);
      const amenities = amenitiesKeys.map((key) => {
        return hotel.amenity_data[key].name;
      });

      requiredAmenities.forEach((requiredAmenity) => {
        if (!amenities.includes(requiredAmenity)) {
          hasAllRequiredAmenities = false;
        }
      });

      if (hasAllRequiredAmenities) {
        const room = hotel.room_data.room_0;
        if (!room) return;
        const roomRate = room.rate_data.rate_0;
        const countPersons = params.nbPerson.adults + params.nbPerson.children;
        const neededRooms = Math.ceil(roomRate.occupancy_limit / countPersons);
        hotelsArray.push({
          hotelName: hotel.name ?? 'No name',
          pricePerRoom: roomRate.price_details.display_total * neededRooms,
          pricePerNight: `${
            (roomRate.price_details.display_total * neededRooms) /
            params.date.nbDays
          }`,
          pricePerNightPerPerson: `${
            (roomRate.price_details.display_total * neededRooms) /
            params.date.nbDays /
            countPersons
          }`,
          nbRooms: neededRooms,
          totalPrice: `${roomRate.price_details.display_total}`,
          nbDays: params.date.nbDays,
          startDate: params.date.startDate,
          endDate: params.date.endDate,
          hotelPosition: {
            latitude: hotel.geo.latitude,
            longitude: hotel.geo.longitude,
          },
          cityPosition: {
            latitude: geoCode.latitude,
            longitude: geoCode.longitude,
          },
          cityName: cityName,
          countryName: countryName,
          amenities: amenities,
          thumbnail: `https:${hotel.thumbnail_hq.three_hundred_square}`,
          description: hotel.hotel_description,
        });
      }

      hasAllRequiredAmenities = true;
    });

    return hotelsArray;
  }

  async getCitiesByCountry(country: string) {
    //Get all cities by country with supabase
    const { data } = await this.supabaseService
      .getClient()
      .from('cities')
      .select('*')
      .eq('countryName', country);
    return data;
  }

  async getCityNameAndCountryNameByGeocode(geoCode: ILocation) {
    try {
      const response = await this.opencageService.getReverseGeocoding(geoCode);
      return {
        cityName: response.data.results[0].components.city,
        countryName: response.data.results[0].components.country,
      };
    } catch (error) {
      console.log(error);
    }
  }

  getAmenitiesArrayFromSearchInput(params: ISearchInput) {
    const amenitiesArray = [];
    if (params.equipments?.swimmingPool) {
      amenitiesArray.push('Swimming Pool');
    }
    if (params.equipments?.parking) {
      amenitiesArray.push('Free Parking');
    }
    if (params.equipments?.spa) {
      amenitiesArray.push('SPA');
    }
    if (params.equipments?.restaurant) {
      amenitiesArray.push('Restaurant');
    }
    if (params.equipments?.bar) {
      amenitiesArray.push('BAR or LOUNGE');
    }
    if (params.equipments?.gym) {
      amenitiesArray.push('FITNESS_CENTER');
    }
    if (params.equipments?.airConditioning) {
      amenitiesArray.push('AIR_CONDITIONING');
    }
    if (params.equipments?.petFriendly) {
      amenitiesArray.push('Pets Allowed');
    }
    if (params.equipments?.kidsFriendly) {
      amenitiesArray.push('KIDS_WELCOME');
    }

    return amenitiesArray;
  }

  arrayToRequestString(array: string[]) {
    return `'[${array.map((item) => `"${item}"`)}]'`;
  }
}
