import { Injectable } from '@nestjs/common';
import { ISearchInput } from '../interfaces';
import { amadeus } from '../amadeus/init';
import { isObject } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class SearchService {
  async getSearch(params: ISearchInput) {
    //console.log(params.destination.city);
    try {
      const response = await amadeus.referenceData.locations.cities.get({
        keyword: params.destination.city,
        countryCode: params.destination.countryCode,
      });

      const { iataCode, geoCode } = response.data[0];

      try {
        const hotels =
          await amadeus.referenceData.locations.hotels.byGeocode.get({
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
            const offers = await amadeus.shopping.hotelOffersSearch.get({
              hotelIds: hotelIds,
              priceRange: '0-3000',
              currency: 'EUR',
              adults: 2,
              radius: 30,
              radiusUnit: 'KM',
              checkInDate: params.date.startDate,
              checkOutDate: params.date.endDate,
              roomQuantity:
                params.nbPerson.adults % 2 === 0
                  ? params.nbPerson.adults / 2
                  : params.nbPerson.adults / 2 + 1,
            });
            result.push(offers.data);
          }

          const res = result[0];

          const final = [];
          res.forEach((element) => {
            console.log(element);
            if (element.type === 'hotel-offers') {
              console.log(element.offers);
              final.push({
                hotelName: element.hotel.name ?? 'No name',
                pricePerRoom: element.offers[0].price.total
                  ? element.offers[0].price.total +
                    ' ' +
                    element.offers[0].price.currency
                  : 'No price',
                pricePerNight: `${
                  element.offers[0].price.total / params.date.nbDays
                } ${element.offers[0].price.currency}`,
                pricePerNightPerPerson: `${
                  element.offers[0].price.total / params.date.nbDays / 2
                } ${element.offers[0].price.currency}`,
                nbRooms:
                  params.nbPerson.adults % 2 === 0
                    ? params.nbPerson.adults / 2
                    : params.nbPerson.adults / 2 + 1,
                totalPrice: `${
                  element.offers[0].price.total *
                  (params.nbPerson.adults % 2 === 0
                    ? params.nbPerson.adults / 2
                    : params.nbPerson.adults / 2 + 1)
                } ${element.offers[0].price.currency}`,
                nbDays: params.date.nbDays,
                startDate: params.date.startDate,
                endDate: params.date.endDate,
                hotelLatitude: element.hotel.latitude,
                hotelLongitude: element.hotel.longitude,
              });
            }
          });
          return final;
        }
      } catch (error) {
        console.log('---------------------------');
        console.log(error);
        console.log('---------------------------');
      }
    } catch (error) {
      console.log('---------------------------');
      console.log(error);
      console.log('---------------------------');
    }
    return [];
  }
}
