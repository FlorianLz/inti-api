import { ISearchInput } from '../../interfaces';

export const jsonData: ISearchInput = {
  nbPerson: {
    adults: 3,
    children: 0,
    babies: 0,
  },
  transport: {
    train: false,
    car: true,
    plane: true,
    bus: false,
    boat: false,
    other: false,
  },
  budget: {
    min: 0,
    max: 1000,
  },
  departure: {
    latitude: 50.63249610631816,
    longitude: 3.052219302864069,
  },
  destination: {
    country: 'Italy',
  },
  date: {
    startDate: '2023-06-20',
    endDate: '2023-06-27',
    nbDays: 8,
    isFlexible: false,
  },
  handicap: false,
  mood: 8,
  locationType: {
    hotel: true,
    apartment: false,
    camping: false,
    other: false,
  },
  formuleType: {
    allInclusive: true,
    halfBoard: false,
    fullBoard: false,
    breakfast: false,
    nothing: false,
  },
  landscape: {
    sea: true,
  },
  nearFromCity: false,
};
