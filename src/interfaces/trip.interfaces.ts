import { IBooking } from './booking.interfaces';
import { IFlight } from './flight.interfaces';

export interface ITrip {
  totalPrice: string;
  travelerPrice: string;
  booking: IBooking;
  flight: IFlight | null;
}
