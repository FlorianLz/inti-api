import { Inject, Injectable } from '@nestjs/common';
import { ILocation, ISearchInput } from '../../../interfaces';
import { IFlight } from '../../../interfaces/flight.interfaces';
import { AmadeusService } from '../../../api/amadeus/amadeus.service';

@Injectable()
export class SearchTransportService {
  @Inject(AmadeusService)
  private readonly amadeusService: AmadeusService;

  async getNearestAirport(position: ILocation) {
    const response = await this.amadeusService
      .getClient()
      .referenceData.locations.airports.get({
        latitude: `${position.latitude}`,
        longitude: `${position.longitude}`,
        radius: 500,
        page: {
          limit: 10,
          offset: 0,
        },
        sort: 'relevance',
      });

    return response.result.data[0];
  }

  async getFlights(
    searchInput: ISearchInput,
    bookingPosition: ILocation,
  ): Promise<IFlight | null> {
    const nearestDepartureAirport = await this.getNearestAirport({
      ...searchInput.departure,
    });

    const nearestArrivalAirport = await this.getNearestAirport(bookingPosition);

    const response = await this.amadeusService
      .getClient()
      .shopping.flightOffersSearch.get({
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
    if (!rawFlight) return null;
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
      price: `${rawFlight.price.grandTotal ?? 0}`,
      itinerary: itinerary,
      fees: fees,
      additionalServices: additionalServices,
      travelerPricing: travelerPricing,
    };
  }
}
