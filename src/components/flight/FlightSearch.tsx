import { useState } from "react";
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
  airport: Airport;
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
        {label} - {airport.code}
      </span>
      <span className="mt-1 block truncate text-lg font-bold text-slate-900">
        {airport.city}
      </span>
      <span className="block truncate text-xs text-slate-500">
        {airport.name}
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
  const [open, setOpen] = useState<OpenPanel>(null);
  const [search, setSearch] = useState<FlightSearchState>({
    from: {
      city: "New Delhi",
      code: "DEL",
      name: "Indira Gandhi International Airport",
      country: "IN",
    },
    to: {
      city: "Hyderabad",
      code: "HYD",
      name: "Rajiv Gandhi International Airport",
      country: "IN",
    },
    departureDate: new Date(2026, 9, 2),
    travellers: { adults: 2, children: 0, infants: 0 },
    cabinClass: "Economy",
    tripType: "oneWay",
  });
  const selectAirport = (field: "from" | "to", airport: Airport) => {
    setSearch((value) => ({ ...value, [field]: airport }));
    setOpen(null);
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
            onClose={() => setOpen(null)}
            onSelect={(airport) => selectAirport("from", airport)}
          />
        )}
        {open === "to" && (
          <AirportModal
            title="destination"
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
          onClick={() => setOpen(null)}
        >
          Search flights
        </Button>
      </div>
    </section>
  );
}
