const filters = ["Non-stop", "1 stop", "Early Departure", "Late Departure"];

export function FlightFilters() {
  return (
    <div className="flex gap-2 overflow-x-auto py-4 [scrollbar-width:none]">
      <button type="button" className="shrink-0 rounded-full border border-blue-500 px-3 py-1.5 text-sm text-blue-600">
        ☷&nbsp; Sort
      </button>
      <button type="button" className="shrink-0 rounded-full border border-blue-500 px-3 py-1.5 text-sm text-blue-600">
        ⇄&nbsp; Filter <b className="ml-1 inline-grid h-4 w-4 place-items-center rounded-full bg-blue-600 text-[10px] text-white">1</b>
      </button>
      {filters.map((filter) => (
        <button key={filter} type="button" className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-900">
          {filter}
        </button>
      ))}
    </div>
  );
}
