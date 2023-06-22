export interface IFlight {
  bookableSeats: number;
  oneWay: boolean;
  itinerary: IFlightItinerary;
  price: string;
  fees: IFlightFee[];
  additionalServices: IFlightFee[];
  travelerPricing: IFlightTravelerPricing[];
}

export interface IFlightItinerary {
  duration: string;
  segments: IFlightItinerarySegment[];
}

export interface IFlightItinerarySegment {
  departure: IItineraryFlightInfo;
  arrival: IItineraryFlightInfo;
  carrierCode: string;
  duration: string;
  id: string;
}
export interface IItineraryFlightInfo {
  iataCode: string;
  at: string;
}

export interface IFlightFee {
  amount: string;
  type: string;
}

export interface IFlightTravelerPricing {
  travelerId: string;
  price: string;
  fareDetailsBySegment: IFlightFareDetailsBySegment[];
}

export interface IFlightFareDetailsBySegment {
  segmentId: string;
  cabin: string;
  class: string;
}
