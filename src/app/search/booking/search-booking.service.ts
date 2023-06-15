import { Inject, Injectable } from '@nestjs/common';
import { AmadeusService } from '../../../api/amadeus/amadeus.service';
import { ILocation, ISearchInput } from '../../../interfaces';
import { SupabaseService } from '../../../api/supabase/supabase.service';
import { IBooking } from '../../../interfaces/booking.interfaces';
import { HttpService } from '@nestjs/axios';
import {OpencageService} from "../../../api/opencage/opencage.service";

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

  async getBookings(params: ISearchInput) {
    if (!params.destination.city) {
      return await this.getBookingByCountry(params);
    }
    return await this.getBookingByCity(params);
  }

  async getCityGeocode(city: string, countryCode: string): Promise<ILocation> {
    try {
      const response = await this.amadeusService
        .getClient()
        .referenceData.locations.cities.get({
          keyword: city,
          countryCode: countryCode,
        });
      return response.data[0].geoCode;
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
    try {
      const { cityName, countryName } =
        await this.getCityNameAndCountryNameByGeocode(geoCode);
      const hotels = await this.amadeusService
        .getClient()
        .referenceData.locations.hotels.byGeocode.get({
          latitude: geoCode.latitude,
          longitude: geoCode.longitude,
        });
      if (hotels.result.data !== undefined) {
        const hotelsIds = hotels.data.map((hotel) => hotel.hotelId);

        function chunkArray(array, chunkSize) {
          const result = [];
          for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            result.push(chunk);
          }
          return result;
        }

        const chunkedArray = chunkArray(hotelsIds, 110);

        const result = [];
        for (const chunk of chunkedArray) {
          const hotelIds = `'[${chunk.map((hotel) => `"${hotel}"`)}]'`;
          //console.log(hotelIds);
          const offers = await this.amadeusService
            .getClient()
            .shopping.hotelOffersSearch.get({
              hotelIds: hotelIds,
              priceRange: '0-3000',
              currency: 'EUR',
              adults: 2,
              radius: 30,
              radiusUnit: 'KM',
              checkInDate: params.date.startDate,
              checkOutDate: params.date.endDate,
              roomQuantity: Math.ceil(params.nbPerson.adults / 2),
            });
          result.push(offers.data);
        }

        const res = result[0];

        const final = [];
        res.forEach((element) => {
          //console.log(element);
          if (element.type === 'hotel-offers') {
            //console.log(element.offers);
            final.push({
              hotelName: element.hotel.name ?? 'No name',
              pricePerRoom: element.offers[0].price.total
                ? element.offers[0].price.total
                : 'No price',
              pricePerNight: `${
                element.offers[0].price.total / params.date.nbDays
              }`,
              pricePerNightPerPerson: `${
                element.offers[0].price.total / params.date.nbDays / 2
              }`,
              nbRooms:
                params.nbPerson.adults % 2 === 0
                  ? params.nbPerson.adults / 2
                  : params.nbPerson.adults / 2 + 1,
              totalPrice: `${
                element.offers[0].price.total *
                (params.nbPerson.adults % 2 === 0
                  ? params.nbPerson.adults / 2
                  : params.nbPerson.adults / 2 + 1)
              }`,
              nbDays: params.date.nbDays,
              startDate: params.date.startDate,
              endDate: params.date.endDate,
              hotelPosition: {
                latitude: element.hotel.latitude,
                longitude: element.hotel.longitude,
              },
              cityPosition: {
                latitude: geoCode.latitude,
                longitude: geoCode.longitude,
              },
              cityName: cityName,
              countryName: countryName,
            });
          }
        });
        return final;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCitiesByCountry(country: string) {
    //Get all cities by country with supabase
    const { data } = await this.supabaseService
      .getClient()
      .from('cities')
      .select('*')
      .eq('countryName', country)
      .limit(3);
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
}
