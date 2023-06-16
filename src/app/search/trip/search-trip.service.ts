import { Inject, Injectable } from '@nestjs/common';
import { ISearchInput } from '../../../interfaces';
import { SearchBookingService } from '../booking/search-booking.service';
import { SearchTransportService } from '../transports/search-transport.service';
import { IBooking } from '../../../interfaces/booking.interfaces';
import { IFlight } from '../../../interfaces/flight.interfaces';
import { ITrip } from '../../../interfaces/trip.interfaces';

@Injectable()
export class SearchTripService {
  @Inject(SearchBookingService)
  private readonly searchBookingService: SearchBookingService;

  @Inject(SearchTransportService)
  private readonly searchTransportService: SearchTransportService;
  async getTripsFromSearch(params: ISearchInput): Promise<ITrip[]> {
    const bookings = await this.searchBookingService.getBookings(params);
    return await this.buildBookingTrips(params, bookings);
  }

  async buildBookingTrips(
    params: ISearchInput,
    bookings: IBooking[],
  ): Promise<ITrip[]> {
    const trips = [];
    const searchedFlights = [];

    if (!bookings) return trips;
    for (const booking of bookings) {
      if (typeof searchedFlights[booking.cityName] === 'undefined') {
        const flight = await this.searchTransportService.getFlights(
          params,
          booking.cityPosition,
        );
        searchedFlights[booking.cityName] = flight ?? null;
      }
      const trip = this.buildTripWithFlightAndBooking(
        params,
        booking,
        searchedFlights[booking.cityName],
      );

      trips.push(trip);
    }
    return trips;
  }

  buildTripWithFlightAndBooking(
    params: ISearchInput,
    booking: IBooking,
    flight: IFlight,
  ): ITrip {
    const bookingTotalPrice = +booking.totalPrice;
    const flightTotalPrice = flight?.price ? +flight.price : 0;
    const totalPrice = bookingTotalPrice + flightTotalPrice;
    const travelerCount =
      +params.nbPerson.adults +
      +params.nbPerson.children +
      +params.nbPerson.babies;
    const travelerPrice = totalPrice / travelerCount;

    return {
      totalPrice: totalPrice.toFixed(2),
      travelerPrice: travelerPrice.toFixed(2),
      booking: booking,
      flight: flight,
    };
  }
}
