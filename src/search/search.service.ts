import { Injectable } from '@nestjs/common';
import { ISearchInput } from '../interfaces';
import { amadeus } from '../amadeus/init';
import { isObject } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class SearchService {
  async getSearch(params: ISearchInput) {
    console.log(params.destination.city);
    const response = await amadeus.referenceData.locations.cities.get({
      keyword: 'Paris',
    });

    const { iataCode, geoCode } = response.data[0];

    const hotels = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: iataCode,
    });

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
      console.log(hotelIds);
      const offers = await amadeus.shopping.hotelOffersSearch.get({
        hotelIds: hotelIds,
        priceRange: '100-300',
        currency: 'EUR',
      });
      result.push(offers.data);
    }

    console.log(result);
    const res = result[1];

    const final = [];
    res.forEach((element) => {
      if (element.type === 'hotel-offers') {
        final.push({
          hotelName: element.hotel.name ?? 'No name',
          price: element.offers[0].price.total
            ? element.offers[0].price.total +
              ' ' +
              element.offers[0].price.currency
            : 'No price',
        });
      }
    });
    return JSON.stringify(final);

    const hotelIds = `'[${chunkedArray[0].map((hotel) => `"${hotel}"`)}]'`;
    console.log(hotelIds);

    const offers = await amadeus.shopping.hotelOffersSearch.get({
      hotelIds: hotelIds,
    });

    return JSON.stringify(offers.data);
  }
}
