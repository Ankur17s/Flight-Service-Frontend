export interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: string;
  tone: "red" | "blue";
  savings?: string;
}

const airlineMarkStyles = {
  red: "bg-rose-600 text-yellow-300",
  blue: "bg-blue-800 text-white",
};

export function FlightCard({ flight }: { flight: FlightResult }) {
  return (
    <article className="border-b border-slate-100 px-3 py-4 last:border-b-0 sm:px-2">
      <div className="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3">
        <div className="text-center">
          <div
            className={`grid h-8 w-8 place-items-center rounded-md text-lg ${airlineMarkStyles[flight.tone]}`}
            aria-hidden="true"
          >
            ✦
          </div>
          <p className="mt-1 text-[10px] font-semibold leading-none text-slate-800">
            {flight.airline}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">{flight.flightNumber}</p>
        </div>
        <div className="flex min-w-0 items-center gap-3 text-sm text-slate-900 sm:gap-4">
          <span className="font-medium">{flight.departureTime}</span>
          <div className="min-w-12 text-center">
            <span className="block text-[11px] text-slate-800">{flight.duration}</span>
            <span className="mx-auto block h-px w-full bg-slate-400" />
            <span className="mt-1 block text-[11px] text-slate-500">non-stop</span>
          </div>
          <span className="font-medium">{flight.arrivalTime}</span>
        </div>
        <p className="text-sm font-bold text-slate-900">₹{flight.price}</p>
      </div>
      {flight.savings && (
        <p className="mt-2 text-right text-xs text-emerald-600">
          <b className="rounded bg-emerald-500 px-1 text-[10px] text-white">WOW!</b>{" "}
          Savings of <b>₹{flight.savings}</b> with FKSALE & more
        </p>
      )}
    </article>
  );
}
