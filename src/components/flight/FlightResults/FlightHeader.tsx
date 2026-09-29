import type { FlightSearchState } from "../../../common/types/flight";

const dates = [
  ["Tue, 29 Sep", "₹6,688"],
  ["Wed, 30 Sep", "₹6,529"],
  ["Thu, 1 Oct", "₹6,529"],
  ["Fri, 2 Oct", "₹6,414"],
  ["Sat, 3 Oct", "₹6,222"],
  ["Sun, 4 Oct", "₹6,530"],
  ["Mon, 5 Oct", "₹6,222"],
];

const dateLabel = (date: Date) =>
  date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

export function FlightHeader({ search }: { search: FlightSearchState }) {
  const from = search.from;
  const to = search.to;
  const travellerTotal = search.travellers.adults + search.travellers.children + search.travellers.infants;

  return (
    <>
      <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2.5 text-sm">
        <span className="text-2xl font-light leading-none">←</span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-medium text-slate-900">
            {from?.code} {from?.cityDetails.name} → {to?.code} {to?.cityDetails.name}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {dateLabel(search.departureDate)} · ✦ {travellerTotal} · {search.cabinClass}
          </p>
        </div>
        <span className="text-xl" aria-label="Edit search">♢</span>
      </div>
      <div className="mt-2 flex overflow-x-auto border-b border-slate-200 [scrollbar-width:none]">
        {dates.map(([date, price], index) => (
          <button
            key={date}
            type="button"
            className={`min-w-[100px] shrink-0 border-b-2 px-3 py-2 text-center text-sm ${index === 3 ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600"}`}
          >
            <span className="block whitespace-nowrap">{date}</span>
            <span className="mt-1 block text-xs">{price}</span>
          </button>
        ))}
        <span className="grid min-w-10 place-items-center text-blue-600">▣</span>
      </div>
    </>
  );
}
