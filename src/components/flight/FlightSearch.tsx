import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAirports } from "../../common/api/airportApi";
import type { Airport, FlightSearchState } from "../../common/types/flight";
import { Button } from "../common/Button";
import { AirportModal } from "./AirportModal";
import { DatePicker } from "./DatePicker";
import { TravellerSelector } from "./TravellerSelector";

type OpenPanel = "from" | "to" | "date" | "travellers" | null;
const formatDate = (date: Date) => ({
  day: date.getDate(),
  weekday: date.toLocaleDateString("en-IN", { weekday: "long" }),
});
const travellerCount = (state: FlightSearchState) =>
  state.travellers.adults +
  state.travellers.children +
  state.travellers.infants;
function AirportField({
  label,
  airport,
  onClick,
  swap,
}: {
  label: string;
  airport: Airport | null;
  onClick: () => void;
  swap?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative min-w-0 flex-1 px-4 py-3 text-left hover:bg-slate-50"
    >
      <span className="block text-xs text-slate-500">
        {label} - {airport?.code ?? "Select airport"}
      </span>
      <span className="mt-1 block truncate text-lg font-bold text-slate-900">
        {airport?.cityDetails.name ?? "Select airport"}
      </span>
      <span className="block truncate text-xs text-slate-500">
        {airport?.name ?? "Choose an airport"}
      </span>
      {swap && (
        <span className="absolute -right-3 top-1/2 z-10 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-blue-500 bg-white text-sm text-blue-600">
          ⇄
        </span>
      )}
    </button>
  );
}
export function FlightSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<OpenPanel>(null);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoadingAirports, setIsLoadingAirports] = useState(true);
  const [airportError, setAirportError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [search, setSearch] = useState<FlightSearchState>({
    from: null,
    to: null,
    departureDate: new Date(2026, 9, 2),
    travellers: { adults: 1, children: 0, infants: 0 },
    cabinClass: "Economy",
    tripType: "oneWay",
  });
  useEffect(() => {
    let isMounted = true;

    const loadAirports = async () => {
      try {
        const loadedAirports = await getAirports();
        if (isMounted) setAirports(loadedAirports);
      } catch {
        if (isMounted)
          setAirportError("Unable to load airports. Please try again.");
      } finally {
        if (isMounted) setIsLoadingAirports(false);
      }
    };

    void loadAirports();
    return () => {
      isMounted = false;
    };
  }, []);
  const selectAirport = (field: "from" | "to", airport: Airport) => {
    setSearch((value) => ({ ...value, [field]: airport }));
    setOpen(null);
  };
  const handleSearch = () => {
    if (!search.from) {
      setValidationError("Please select departure airport.");
      return;
    }
    if (!search.to) {
      setValidationError("Please select destination airport.");
      return;
    }
    if (search.from.id === search.to.id) {
      setValidationError("Source and destination airport cannot be the same.");
      return;
    }

    navigate("/flight-search/travel", { state: { search } });
  };
  const date = formatDate(search.departureDate);
  return (
    <section className="relative mx-auto w-full max-w-5xl rounded-2xl bg-white p-4 shadow-xl shadow-slate-900/15 ring-1 ring-slate-200 sm:p-5">
      <div className="mb-5 flex gap-6 text-sm font-semibold">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            checked={search.tripType === "oneWay"}
            onChange={() =>
              setSearch((value) => ({ ...value, tripType: "oneWay" }))
            }
            className="h-5 w-5 accent-blue-600"
          />
          One Way
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            checked={search.tripType === "roundTrip"}
            onChange={() =>
              setSearch((value) => ({ ...value, tripType: "roundTrip" }))
            }
            className="h-5 w-5 accent-blue-600"
          />
          Round Trip
        </label>
      </div>
      <div className="relative grid overflow-visible rounded-2xl border border-slate-200 lg:grid-cols-[1.2fr_1.2fr_.85fr_.85fr_1.2fr]">
        <AirportField
          label="From"
          airport={search.from}
          onClick={() => setOpen("from")}
          swap
        />
        <AirportField
          label="To"
          airport={search.to}
          onClick={() => setOpen("to")}
        />
        <button
          type="button"
          onClick={() => setOpen("date")}
          className="border-t border-slate-200 px-4 py-3 text-left hover:bg-slate-50 lg:border-l lg:border-t-0"
        >
          <span className="block text-xs text-blue-600">Departure</span>
          <span className="mt-1 block text-base font-bold">{date.day} Oct</span>
          <span className="text-xs text-slate-500">{date.weekday}</span>
        </button>
        <button
          type="button"
          disabled={search.tripType === "oneWay"}
          className="border-t border-slate-200 px-4 py-3 text-left disabled:text-slate-400 hover:bg-slate-50 lg:border-l lg:border-t-0"
        >
          <span className="block text-xs text-slate-500">Return</span>
          <span className="mt-2 block text-sm font-semibold">
            {search.tripType === "oneWay" ? "Add for discounts" : "Select date"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setOpen("travellers")}
          className="border-t border-slate-200 px-4 py-3 text-left hover:bg-slate-50 lg:border-l lg:border-t-0"
        >
          <span className="block text-xs text-blue-600">
            Travellers & Class
          </span>
          <span className="mt-1 block text-base font-bold">
            {travellerCount(search)} Adults
          </span>
          <span className="text-xs text-slate-500">{search.cabinClass}</span>
        </button>
        {open === "from" && (
          <AirportModal
            title="origin"
            airports={airports}
            isLoading={isLoadingAirports}
            error={airportError}
            onClose={() => setOpen(null)}
            onSelect={(airport) => selectAirport("from", airport)}
          />
        )}
        {open === "to" && (
          <AirportModal
            title="destination"
            airports={airports}
            isLoading={isLoadingAirports}
            error={airportError}
            onClose={() => setOpen(null)}
            onSelect={(airport) => selectAirport("to", airport)}
          />
        )}
        {open === "date" && (
          <DatePicker
            date={search.departureDate}
            onClose={() => setOpen(null)}
            onSelect={(departureDate) =>
              setSearch((value) => ({ ...value, departureDate }))
            }
          />
        )}
        {open === "travellers" && (
          <TravellerSelector
            travellers={search.travellers}
            cabinClass={search.cabinClass}
            onClose={() => setOpen(null)}
            onUpdate={(travellers, cabinClass) =>
              setSearch((value) => ({ ...value, travellers, cabinClass }))
            }
          />
        )}
      </div>
      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* <label className="flex items-center gap-3 rounded-xl border border-blue-200 px-3 py-2 text-sm">
          <input type="checkbox" className="h-5 w-5 rounded" />
          <span>
            <b className="block">
              Save additional 10%{" "}
              <em className="ml-1 rounded bg-orange-500 px-1.5 py-0.5 text-[10px] not-italic text-white">
                NEW
              </em>
            </b>
            <small className="text-emerald-600">
              If you are traveling for work
            </small>
          </span>
        </label>
        <span className="text-xs text-slate-500">Special fares (Optional)</span>
        <div className="flex flex-1 gap-2 overflow-x-auto">
          <span className="rounded-lg border px-2 py-1 text-xs">
            Student
            <br />
            <b className="font-normal text-emerald-600">
              Extra baggage, discounts
            </b>
          </span>
          <span className="rounded-lg border px-2 py-1 text-xs">
            Senior Citizen
            <br />
            <b className="font-normal text-emerald-600">Up to ₹600 OFF</b>
          </span>
        </div> */}
        <Button
          type="button"
          className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-300 lg:w-64"
          onClick={handleSearch}
        >
          Search flights
        </Button>
      </div>
      {validationError && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="flight-search-validation-title"
          className="fixed inset-0 z-40 grid place-items-center bg-slate-900/30 px-4"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2
              id="flight-search-validation-title"
              className="text-lg font-bold text-slate-900"
            >
              Invalid Flight Search
            </h2>
            <p className="mt-3 text-sm text-slate-600">{validationError}</p>
            <Button
              type="button"
              className="mt-5 bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setValidationError(null)}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
