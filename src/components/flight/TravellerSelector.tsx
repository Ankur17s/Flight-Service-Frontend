import type { CabinClass, Travellers } from "../../common/types/flight";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { TravellerCounter } from "./TravellerCounter";

const classes: CabinClass[] = ["Economy", "Premium Economy", "Business"];
export function TravellerSelector({
  travellers,
  cabinClass,
  onClose,
  onUpdate,
}: {
  travellers: Travellers;
  cabinClass: CabinClass;
  onClose: () => void;
  onUpdate: (travellers: Travellers, cabinClass: CabinClass) => void;
}) {
  const update = (key: keyof Travellers, value: number) =>
    onUpdate({ ...travellers, [key]: value }, cabinClass);
  return (
    <Modal
      onClose={onClose}
      className="right-0 top-[calc(100%+8px)] w-[min(470px,calc(100vw-2rem))]"
    >
      <div className="rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200 sm:p-5">
        <div className="grid gap-7 sm:grid-cols-[1.15fr_.85fr]">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Select travellers
            </h2>
            <div className="mt-4 space-y-5">
              <TravellerCounter
                label="Adults"
                note="12+ years"
                value={travellers.adults}
                minimum={1}
                onChange={(value) => update("adults", value)}
              />
              <TravellerCounter
                label="Children"
                note="2-12 years"
                value={travellers.children}
                onChange={(value) => update("children", value)}
              />
              <TravellerCounter
                label="Infants"
                note="Below 2 years"
                value={travellers.infants}
                onChange={(value) => update("infants", value)}
              />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Select class</h2>
            <div className="mt-3 space-y-3">
              {classes.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
                >
                  <input
                    type="radio"
                    checked={cabinClass === option}
                    onChange={() => onUpdate(travellers, option)}
                    className="h-5 w-5 accent-blue-600"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button type="button" className="w-28" onClick={onClose}>
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  );
}
