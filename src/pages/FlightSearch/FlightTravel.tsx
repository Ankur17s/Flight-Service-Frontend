import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { FlightSearchState } from "../../common/types/flight";
import { FlightCard, FlightFilters, FlightHeader, type FlightResult } from "../../components/flight/FlightResults";

const mockFlights: FlightResult[] = [
  { id: "sg-2802", airline: "SpiceJet", flightNumber: "SG-2802", departureTime: "22:30", arrivalTime: "01:10", duration: "2h 40m", price: "6,414", tone: "red", savings: "922" },
  { id: "sg-162", airline: "SpiceJet", flightNumber: "SG-162", departureTime: "19:55", arrivalTime: "22:40", duration: "2h 45m", price: "6,414", tone: "red", savings: "922" },
  { id: "6e-955", airline: "IndiGo", flightNumber: "6E-955", departureTime: "20:20", arrivalTime: "22:20", duration: "2h", price: "6,529", tone: "blue" },
];

type LocationState = { search?: FlightSearchState };

export default function FlightTravel() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const search = (state as LocationState | null)?.search;

  const hasSearch = Boolean(search?.from && search.to);

  useEffect(() => {
    if (!hasSearch) navigate("/flight-search", { replace: true });
  }, [hasSearch, navigate]);

  if (!search || !search.from || !search.to) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white px-3 py-3 text-slate-900 sm:px-6">
      <section className="mx-auto w-full max-w-[752px]">
        <FlightHeader search={search} />
        <FlightFilters />
        <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
          <div className="flex items-center justify-between font-medium">
            <p>Current prices are in the <span className="text-red-600">higher</span> range</p>
            <span>⌄</span>
          </div>
          <p className="mt-2 text-xs text-slate-700"><span className="mr-2 text-red-600">⌁</span> Prices are likely to increase in the next few days. Book now</p>
        </div>
        <div className="mt-4">
          {mockFlights.map((flight) => <FlightCard key={flight.id} flight={flight} />)}
        </div>
      </section>
    </main>
  );
}
