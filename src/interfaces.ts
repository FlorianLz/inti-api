export interface ISearchInput {
  nbPerson: INbPerson;
  transport: ITransport;
  budget?: IBudget;
  destination: IDestination;
  date: IDateInput;
  handicap?: boolean;
  mood?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  locationType: ILocationType;
  formuleType: IFormuleTypeInput;
  landscape?: ILandscape;
  nearFromCity?: boolean;
  equipments?: IEquipmentInput;
}

export interface IDestination {
  country?: string;
  countryCode?: string;
  city?: string;
  continent?: string;
}

export interface IDateInput {
  startDate?: string;
  endDate?: string;
  nbDays: number;
  isFlexible: boolean;
  flexible?: number;
}

export interface IBudget {
  min: number;
  max: number;
}

export interface ITransport {
  train: boolean;
  car: boolean;
  plane: boolean;
  bus: boolean;
  boat: boolean;
  other: boolean;
}

export interface ILocationType {
  hotel: boolean;
  apartment: boolean;
  camping: boolean;
  other: boolean;
}

export interface IFormuleTypeInput {
  allInclusive: boolean;
  halfBoard: boolean;
  fullBoard: boolean;
  breakfast: boolean;
  nothing: boolean;
}

export interface ILandscape {
  sea?: boolean;
  mountain?: boolean;
  flat?: boolean;
}

export interface IEquipmentInput {
  swimmingPool?: boolean;
  parking?: boolean;
  spa?: boolean;
  gym?: boolean;
  restaurant?: boolean;
  bar?: boolean;
  airConditioning?: boolean;
  petFriendly?: boolean;
  kidsFriendly?: boolean;
}

export interface ISearchOutput {
  id: number;
  searchOutputItems: ISearchOutputItem[];
  searchInput: ISearchInput;
}

export interface ISearchOutputItem {
  location: ILocation;
  equipments: IEquipment[];
  landscapePictures?: string[];
  bookingItem: IBookingItem;
  mood?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  landscapeType?: ILandscape;
  score?: number;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IEquipment {
  name: string;
  description?: string;
  icon?: string;
}

export interface IBookingItem {
  name: string;
  description?: string;
  price: number;
  rating?: number;
  pictures?: string[];
  url?: string;
  bookingType: ILocationType;
}

export interface IFormData {
  destination?: IDestination;
  nbPerson?: INbPerson;
  date?: IDateInput;
  budget?: IBudget;
  transport?: ITransport;
  formSteps?: IFormStep[];
  isGroup?: boolean;
  groupEmails?: string[];
  groupOwner?: string;
  formStatus?: string;
}

export interface INbPerson {
  adults: number;
  children: number;
  babies: number;
}

export interface IFormStep {
  name: string;
  value: any;
}
