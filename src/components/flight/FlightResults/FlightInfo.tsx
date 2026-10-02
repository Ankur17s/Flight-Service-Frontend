import { useLocation, useNavigate } from "react-router-dom";
import type { SearchedFlight } from "../../../common/types/flight";

interface FlightInfoState {
  flight: SearchedFlight;
  travellers: number;
}

export default function FlightInfo() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as FlightInfoState | null;

  if (!state) {
    return (
      <main className="min-h-screen bg-white px-4 py-6">
        <div className="mx-auto max-w-[752px]">
          <p className="text-center text-slate-600">
            Flight information is not available.
          </p>

          <button
            type="button"
            onClick={() => navigate("/flight-search/travel")}
            className="mt-4 block mx-auto text-blue-600"
          >
            Back to flights
          </button>
        </div>
      </main>
    );
  }

  const { flight, travellers } = state;

  const totalFare = flight.price * travellers;

  const departure = new Date(flight.departureTime);
  const arrival = new Date(flight.arrivalTime);

  const departureTime = departure.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const arrivalTime = arrival.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const departureDate = departure.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const durationInMinutes =
    (arrival.getTime() - departure.getTime()) / (1000 * 60);

  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  const duration = `${hours}h ${minutes}m`;

  return (
    <main className="min-h-screen bg-white px-3 py-4 text-slate-900 sm:px-6">
      <section className="mx-auto w-full max-w-[752px]">
        {/* Back header */}
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-2xl"
          >
            ←
          </button>

          <h1 className="text-lg font-semibold">
            Flight Details
          </h1>
        </div>

        {/* Flight details */}
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <div className="bg-blue-700 px-4 py-4 text-white">
            <p className="text-sm font-semibold">
              {flight.flightNumber}
            </p>

            <p className="mt-1 text-xs text-blue-100">
              {flight.airplaneDetail.modelNumber}
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-4">
              {/* Departure */}
              <div>
                <p className="text-xs text-slate-500">
                  {departureDate}
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {flight.departureAirport.code} {departureTime}
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {flight.departureAirport.cityDetails.name}
                </p>

                <p className="text-xs text-slate-500">
                  {flight.departureAirport.name}
                </p>
              </div>

              {/* Duration */}
              <div className="min-w-[80px] text-center">
                <p className="text-sm text-slate-500">
                  {duration}
                </p>

                <div className="my-2 border-t border-slate-300" />

                <p className="text-xs text-slate-500">
                  Non-stop
                </p>
              </div>

              {/* Arrival */}
              <div className="text-right">
                <p className="text-xs text-slate-500">
                  {departureDate}
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {arrivalTime} {flight.arrivalAirport.code}
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {flight.arrivalAirport.cityDetails.name}
                </p>

                <p className="text-xs text-slate-500">
                  {flight.arrivalAirport.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fare */}
        <div className="mt-5 rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Fare
              </p>

              <p className="mt-1 text-2xl font-bold">
                ₹{totalFare.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                for {travellers} traveller
                {travellers > 1 ? "s" : ""}
              </p>
            </div>

            <button
              type="button"
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}