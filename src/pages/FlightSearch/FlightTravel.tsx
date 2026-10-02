import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { SearchedFlight } from "../../common/types/flight";
import {
  FlightCard,
  FlightFilters,
  FlightHeader,
} from "../../components/flight/FlightResults";
import { searchFlights } from "../../common/api/flightApi";

export default function FlightTravel() {
  const [flights, setFlights] = useState<SearchedFlight[]>([]);

  const [routeDetails, setRouteDetails] = useState<{
    fromCode: string;
    toCode: string;
    fromCity: string;
    toCity: string;
  } | null>(null);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [initialTripDate] = useState(() => searchParams.get("tripDate"));

  const trips = searchParams.get("trips");
  const price = searchParams.get("price");
  const travellers = searchParams.get("travellers");
  const sort = searchParams.get("sort");
  const tripDate = searchParams.get("tripDate");

  const handleDateSelect = (date: Date) => {
    const dateValue = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    setSearchParams((currentParams) => {
      const updatedParams = new URLSearchParams(currentParams);
      updatedParams.set("tripDate", dateValue);

      return updatedParams;
    });
  };

  const hasSearch =
    Boolean(trips) &&
    Boolean(price) &&
    Boolean(travellers) &&
    Boolean(tripDate);

  useEffect(() => {
    if (!hasSearch) {
      navigate("/flight-search", { replace: true });
    }
  }, [hasSearch, navigate]);

  useEffect(() => {
    if (!hasSearch) return;

    const fetchFlights = async () => {
      try {
        const params = {
          trips: trips!,
          price: price!,
          travellers: Number(travellers),
          ...(sort ? { sort } : {}),
          tripDate: tripDate!,
        };

        const response = await searchFlights(params);
        setFlights(response.data);

        // Keep route details even when a later search returns no flights.
        if (response.data.length > 0) {
          const firstFlight = response.data[0];

          setRouteDetails({
            fromCode: firstFlight.departureAirport.code,
            toCode: firstFlight.arrivalAirport.code,
            fromCity: firstFlight.departureAirport.cityDetails.name,
            toCity: firstFlight.arrivalAirport.cityDetails.name,
          });
        }
      } catch (error) {
        console.error("Flight API error:", error);
        setFlights([]);
      }
    };

    void fetchFlights();
  }, [hasSearch, trips, price, travellers, sort, tripDate]);

  if (!hasSearch) {
    return null;
  }

  const [fromCode, toCode] = trips?.split("-") ?? ["", ""];

  return (
    <main className="min-h-screen bg-white px-3 py-3 text-slate-900 sm:px-6">
      <section className="mx-auto w-full max-w-[752px]">
        <FlightHeader
          fromCode={routeDetails?.fromCode ?? fromCode}
          toCode={routeDetails?.toCode ?? toCode}
          fromCity={routeDetails?.fromCity ?? ""}
          toCity={routeDetails?.toCity ?? ""}
          travellers={Number(travellers)}
          tripDate={tripDate!}
          startDate={initialTripDate!}
          onDateSelect={handleDateSelect}
        />

        <FlightFilters />

        <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
          <div className="flex items-center justify-between font-medium">
            <p>
              Current prices are in the{" "}
              <span className="text-red-600">higher</span> range
            </p>

            <span>⌄</span>
          </div>

          <p className="mt-2 text-xs text-slate-700">
            <span className="mr-2 text-red-600">⌁</span>
            Prices are likely to increase in the next few days. Book now
          </p>
        </div>

        {flights.length === 0 ? (
          <div className="mt-6 rounded-xl border border-slate-200 px-4 py-10 text-center">
            <p className="text-base font-semibold text-slate-800">
              No flights available
            </p>

            <p className="mt-1 text-sm text-slate-500">
              No flights are available for {tripDate}.
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Try selecting another date.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            {flights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                travellers={Number(travellers)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
