export interface Airport {
  id: number;
  name: string;
  code: string;
  address: string | null;
  cityId: number;
  createdAt: string;
  updatedAt: string;
  cityDetails: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AirportApiResponse {
  success: boolean;
  message: string;
  data: Airport[];
}
export type CabinClass = "Economy" | "Premium Economy" | "Business";
export interface Travellers {
  adults: number;
  children: number;
  infants: number;
}
export interface FlightSearchState {
  from: Airport | null;
  to: Airport | null;
  departureDate: Date | null;
  travellers: Travellers;
  cabinClass: CabinClass;
  tripType: "oneWay" | "roundTrip";
}

export interface AirplaneDetail {
  id: number;
  modelNumber: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchedFlight {
  id: number;
  flightNumber: string;
  airplaneId: number;
  departureAirportId: string;
  arrivalAirportId: string;
  arrivalTime: string;
  departureTime: string;
  price: number;
  boardingGate: string | null;
  totalSeats: number;
  createdAt: string;
  updatedAt: string;
  airplaneDetail: AirplaneDetail;
  departureAirport: Airport;
  arrivalAirport: Airport;
}

export interface SearchedFlightApiResponse {
  success: boolean;
  message: string;
  data: SearchedFlight[];
  error: Record<string, unknown>;
}

export interface FlightSearchParams {
  trips: string;
  price: string;
  travellers: number;
  sort?: string;
  tripDate: string;
}
