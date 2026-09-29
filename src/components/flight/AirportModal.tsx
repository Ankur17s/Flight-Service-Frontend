import { useMemo, useState } from "react";
import type { Airport } from "../../common/types/flight";
import { Modal } from "../common/Modal";

export function AirportModal({
  onClose,
  onSelect,
  title,
  airports,
  isLoading,
  error,
}: {
  onClose: () => void;
  onSelect: (airport: Airport) => void;
  title: string;
  airports: Airport[];
  isLoading: boolean;
  error: string | null;
}) {
  const [query, setQuery] = useState("");
  const matches = useMemo(
    () =>
      airports.filter((airport) =>
        `${airport.cityDetails.name} ${airport.code} ${airport.name}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <Modal
      onClose={onClose}
      className="left-0 top-[calc(100%+8px)] w-[min(326px,calc(100vw-2rem))]"
    >
      <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-slate-200">
        <label className="flex h-10 items-center gap-2 rounded-xl border border-blue-500 px-3 text-slate-500 focus-within:ring-2 focus-within:ring-blue-100">
          <span aria-hidden="true">⌕</span>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${title.toLowerCase()} city/airport`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <p className="px-2 pb-2 pt-3 text-xs font-semibold text-slate-600">
          Popular Cities
        </p>
        <div className="max-h-64 overflow-y-auto">
          {isLoading && (
            <p className="px-2 py-6 text-center text-sm text-slate-500">
              Loading airports...
            </p>
          )}
          {!isLoading && error && (
            <p
              role="alert"
              className="px-2 py-6 text-center text-sm text-rose-600"
            >
              {error}
            </p>
          )}
          {!isLoading &&
            !error &&
            matches.map((airport) => (
              <button
                key={airport.id}
                type="button"
                onClick={() => onSelect(airport)}
                className="flex w-full items-start justify-between rounded-lg px-2 py-2 text-left hover:bg-blue-50"
              >
                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    {airport.cityDetails.name}
                  </span>
                  <span className="block max-w-56 truncate text-xs text-slate-600">
                    {airport.name}
                  </span>
                </span>
                <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                  {airport.code}
                </span>
              </button>
            ))}
          {!isLoading && !error && matches.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-slate-500">
              No airports found.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
