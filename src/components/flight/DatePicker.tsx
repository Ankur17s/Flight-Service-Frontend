import { useState } from "react";
import { Modal } from "../common/Modal";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const isSameDay = (left: Date, right: Date) =>
  left.toDateString() === right.toDateString();
const monthLabel = (date: Date) =>
  date.toLocaleString("en-IN", { month: "long", year: "numeric" });
function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}
function Month({
  date,
  selected,
  onSelect,
}: {
  date: Date;
  selected: Date | null;
  onSelect: (date: Date) => void;
}) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = (first.getDay() + 6) % 7;
  const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <div>
      <h3 className="mb-3 text-center text-base font-bold text-slate-800">
        {monthLabel(date)}
      </h3>
      <div className="grid grid-cols-7 text-center text-[11px] font-medium text-slate-600">
        {weekdays.map((day) => (
          <span
            key={day}
            className={day === "Sat" || day === "Sun" ? "text-rose-400" : ""}
          >
            {day}
          </span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-y-1">
        {Array.from({ length: start }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}
        {Array.from({ length: days }, (_, index) => {
          const value = new Date(
            date.getFullYear(),
            date.getMonth(),
            index + 1,
          );
          const disabled = value.getTime() < today.getTime();
          const chosen = selected ? isSameDay(value, selected) : false;
          return (
            <button
              key={index}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(value)}
              className={`mx-auto grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${chosen ? "bg-blue-600 text-white shadow-md" : "text-slate-700 hover:bg-blue-50"} disabled:text-slate-300 disabled:hover:bg-transparent`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export function DatePicker({
  date,
  onClose,
  onSelect,
}: {
  date: Date | null;
  onClose: () => void;
  onSelect: (date: Date) => void;
}) {
  const today = new Date();

  const [month, setMonth] = useState(
    date
      ? new Date(date.getFullYear(), date.getMonth(), 1)
      : new Date(today.getFullYear(), today.getMonth(), 1),
  );
  return (
    <Modal
      onClose={onClose}
      className="left-1/2 top-[calc(100%+10px)] w-[min(650px,calc(100vw-2rem))] -translate-x-1/2"
    >
      <div className="rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200 sm:p-7">
        <div className="mb-4 flex justify-end gap-2">
          <button
            aria-label="Previous month"
            type="button"
            onClick={() => setMonth(addMonths(month, -1))}
            className="grid h-7 w-7 place-items-center rounded-full text-xl hover:bg-slate-100"
          >
            ‹
          </button>
          <button
            aria-label="Next month"
            type="button"
            onClick={() => setMonth(addMonths(month, 1))}
            className="grid h-7 w-7 place-items-center rounded-full text-xl hover:bg-slate-100"
          >
            ›
          </button>
        </div>
        <div className="grid gap-7 sm:grid-cols-2 sm:gap-10">
          <Month
            date={month}
            selected={date}
            onSelect={(value) => {
              onSelect(value);
              onClose();
            }}
          />
          <Month
            date={addMonths(month, 1)}
            selected={date}
            onSelect={(value) => {
              onSelect(value);
              onClose();
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
