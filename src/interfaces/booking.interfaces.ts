import { ILocation } from '../interfaces';

export interface IBooking {
  hotelName: string;
  pricePerRoom: string;
  pricePerNight: string;
  pricePerNightPerPerson: string;
  nbRooms: number;
  totalPrice: string;
  nbDays: number;
  startDate: string;
  endDate: string;
  hotelPosition: ILocation;
  cityPosition: ILocation;
  cityName: string;
  countryName: string;
}
