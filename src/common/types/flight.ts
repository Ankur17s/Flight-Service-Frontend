export interface Airport { city: string; code: string; name: string; country: string }
export type CabinClass = 'Economy' | 'Premium Economy' | 'Business'
export interface Travellers { adults: number; children: number; infants: number }
export interface FlightSearchState { from: Airport; to: Airport; departureDate: Date; travellers: Travellers; cabinClass: CabinClass; tripType: 'oneWay' | 'roundTrip' }
