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
  departureDate: Date;
  travellers: Travellers;
  cabinClass: CabinClass;
  tripType: "oneWay" | "roundTrip";
}
