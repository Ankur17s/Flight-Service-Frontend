const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
};

export function FlightHeader({
  fromCode,
  toCode,
  fromCity,
  toCity,
  travellers,
  tripDate,
  startDate,
  onDateSelect,
}: {
  fromCode: string;
  toCode: string;
  fromCity: string;
  toCity: string;
  travellers: number;
  tripDate: string;
  startDate: string;
  onDateSelect: (date: Date) => void;
}) {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const startDateObject = new Date(`${startDate}T00:00:00`);

  const dates = Array.from({ length: 15 }, (_, index) =>
    addDays(startDateObject, index),
  );

  const selectedDateObject = new Date(`${tripDate}T00:00:00`);

  const selectedDate = tripDate;

  const dateLabel = selectedDateObject.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

  return (
    <>
      <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2.5 text-sm">
        <span className="text-2xl font-light leading-none">←</span>

        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-medium text-slate-900">
            {fromCode} {fromCity} → {toCode} {toCity}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {dateLabel} · ✦ {travellers}
          </p>
        </div>

        <span className="text-xl" aria-label="Edit search">
          ♢
        </span>
      </div>

      <div className="mt-2 flex overflow-x-auto border-b border-slate-200 scrollbar-none">
        {dates.map((date) => {
          const dateValue = date.toLocaleDateString("en-CA");

          const isSelected = dateValue === selectedDate;

          return (
            <button
              key={dateValue}
              type="button"
              onClick={() => onDateSelect(date)}
              className={`min-w-[100px] shrink-0 border-b-2 mx-1 py-2 text-center text-sm cursor-pointer ${
                isSelected
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600"
              }`}
            >
              <span className="block whitespace-nowrap">
                {formatDate(date)}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
