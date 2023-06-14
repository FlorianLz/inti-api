import { Injectable } from '@nestjs/common';
import { ISearchInput } from '../interfaces';
import { amadeus } from '../amadeus/init';
import { isObject } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class SearchService {
  async getSearch(params: ISearchInput) {
    console.log(params.destination.city);
    const response = await amadeus.referenceData.locations.cities.get({
      keyword: 'Lyon',
    });

    //return JSON.stringify(response.data);

    const { iataCode, geoCode } = response.data[0];

    const hotels = await amadeus.referenceData.locations.hotels.byGeocode.get({
      latitude: geoCode.latitude,
      longitude: geoCode.longitude,
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
        priceRange: '0-3000',
        currency: 'EUR',
        adults: 2,
        radius: 5,
        radiusUnit: 'KM',
        checkInDate: params.date.startDate,
        checkOutDate: params.date.endDate,
        roomQuantity: params.nbPerson.adults % 2 === 0 ? params.nbPerson.adults / 2 : params.nbPerson.adults / 2 + 1,
      });
      result.push(offers.data);
    }

    console.log(result);
    const res = result[0];

    const final = [];
    res.forEach((element) => {
      if (element.type === 'hotel-offers') {
        console.log(element.offers);
        final.push({
          hotelName: element.hotel.name ?? 'No name',
          pricePerRoom: element.offers[0].price.total
            ? element.offers[0].price.total +
              ' ' +
              element.offers[0].price.currency
            : 'No price',
          pricePerNight: element.offers[0].price.total / params.date.nbDays,
          pricePerNightPerPerson: element.offers[0].price.total / params.date.nbDays / 2,
          nbRooms: params.nbPerson.adults % 2 === 0 ? params.nbPerson.adults / 2 : params.nbPerson.adults / 2 + 1,
          totalPrice: element.offers[0].price.total * (params.nbPerson.adults % 2 === 0 ? params.nbPerson.adults / 2 : params.nbPerson.adults / 2 + 1),
        });
      }
    });
    return JSON.stringify(final);
  }
}
