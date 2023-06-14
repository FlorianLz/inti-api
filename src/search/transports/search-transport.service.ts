import { Injectable } from '@nestjs/common';
import { ILocation, ISearchInput } from '../../interfaces';
import { HttpService } from '@nestjs/axios';
import { amadeus } from '../../amadeus/init';
import { IFlight } from '../../interfaces/flight.interfaces';

@Injectable()
export class SearchTransportService {
  constructor(private readonly httpService: HttpService) {}

  async getAvailableTransportForSearchBooking(
    searchInput: ISearchInput,
    bookingPosition: ILocation,
  ) {
    const flights = await this.getFlights(searchInput, bookingPosition);
    return { flights };
  }

  async getNearestAirport(position: ILocation) {
    const response = await amadeus.referenceData.locations.airports.get({
      latitude: `${position.latitude}`,
      longitude: `${position.longitude}`,
      radius: 500,
      page: {
        limit: 10,
        offset: 0,
      },
      sort: 'relevance',
    });

    console.log(response.result.meta.count);
    return response.result.data[0];
  }

  async getFlights(
    searchInput: ISearchInput,
    bookingPosition: ILocation,
  ): Promise<IFlight> {
    const nearestDepartureAirport = await this.getNearestAirport({
      ...searchInput.departure,
    });

    const nearestArrivalAirport = await this.getNearestAirport(bookingPosition);

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: nearestDepartureAirport.iataCode,
      destinationLocationCode: nearestArrivalAirport.iataCode,
      departureDate: searchInput.date.startDate,
      adults: searchInput.nbPerson.adults,
      children: searchInput.nbPerson.children,
      infants: searchInput.nbPerson.babies,
    });

    const rawFlight = response.result.data[0];
    return this.rawFlightToFlight(rawFlight);
  }

  rawFlightToFlight(rawFlight: any): IFlight {
    const itinerarySegments = rawFlight.itineraries[0].segments.map(
      (segment) => {
        return {
          departure: {
            iataCode: segment.departure.iataCode,
            at: segment.departure.at,
          },
          arrival: {
            iataCode: segment.arrival.iataCode,
            at: segment.arrival.at,
          },
          carrierCode: segment.carrierCode,
          duration: segment.duration,
          id: segment.id,
        };
      },
    );

    const itinerary = {
      duration: rawFlight.itineraries[0].duration ?? 'OM',
      segments: itinerarySegments,
    };

    const fees = rawFlight.price.fees.map((fee) => {
      return {
        amount: fee.amount,
        type: fee.type,
      };
    });

    const additionalServices = rawFlight.price.additionalServices.map(
      (service) => {
        return {
          amount: service.amount,
          type: service.type,
        };
      },
    );

    const travelerPricing = rawFlight.travelerPricings.map((traveler) => {
      const fareDetailsBySegment = traveler.fareDetailsBySegment.map(
        (segment) => {
          return {
            segmentId: segment.segmentId,
            cabin: segment.cabin,
            class: segment.class,
          };
        },
      );

      return {
        travelerId: traveler.travelerId,
        fareDetailsBySegment: fareDetailsBySegment,
        price: `${traveler.price.total ?? 0} ${traveler.price.currency}`,
      };
    });

    return {
      bookableSeats: rawFlight.numberOfBookableSeats ?? 0,
      oneWay: rawFlight.oneWay ?? false,
      price: `${rawFlight.price.grandTotal ?? 0} ${rawFlight.price.currency}`,
      itinerary: itinerary,
      fees: fees,
      additionalServices: additionalServices,
      travelerPricing: travelerPricing,
    };
  }
}
