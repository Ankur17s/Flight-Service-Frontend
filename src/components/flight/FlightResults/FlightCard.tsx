import type { SearchedFlight } from "../../../common/types/flight";

export function FlightCard({ flight }: { flight: SearchedFlight }) {
  const departure = new Date(flight.departureTime);
  const arrival = new Date(flight.arrivalTime);

  const durationInMinutes =
    (arrival.getTime() - departure.getTime()) / (1000 * 60);

  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  const duration = `${hours}h ${minutes}m`;

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
  return (
    <article className="border-b border-slate-100 px-3 py-4 last:border-b-0 sm:px-2">
      <div className="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-12">
        <div className="text-center">
          <div
            className={`grid h-8 w-8 place-items-center rounded-md text-lg `}
            aria-hidden="true"
          >
            ✦
          </div>
          <p className="mt-1 text-[12px] font-semibold leading-none text-slate-800">
            {flight.airplaneDetail.modelNumber}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            {flight.flightNumber}
          </p>
        </div>
        <div className="flex min-w-0 items-center gap-3 text-sm text-slate-900 sm:gap-4">
          <span className="text-lg">{departureTime}</span>
          <div className="min-w-12 text-center">
            <span className="block text-[11px] text-slate-800">{duration}</span>
            <span className="mx-auto block h-px w-full bg-slate-400" />
            <span className="mt-1 block text-[11px] text-slate-500">
              non-stop
            </span>
          </div>
          <span className="text-lg">{arrivalTime}</span>
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900">₹{flight.price}</p>
          <p className="text-xs text-slate-500">per adult</p>
        </div>
      </div>
    </article>
  );
}
