import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import type { SearchedFlight } from "../../common/types/flight";
import type { Booking } from "../../common/api/bookingApi";
import { makePayment } from "../../common/api/paymentApi";
import { getLoggedInUserId } from "../../common/auth/authStorage";
import { Modal } from "../../components/common/Modal";

interface PaymentState {
  booking: Booking;
  flight: SearchedFlight;
  travellers: number;
  selectedAdults: {
    id: number;
    firstName: string;
    lastName: string;
    gender: "Male";
  }[];
  contact: {
    email: string;
    phone: string;
  } | null;
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentState | null;

  const [showFareBreakup, setShowFareBreakup] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (!state) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-[720px] rounded-xl bg-white p-6">
          <p className="text-slate-700">
            Booking details are not available. Please select a flight again.
          </p>

          <Button
            type="button"
            className="mt-4"
            onClick={() => navigate("/flight-search")}
          >
            Back to flight search
          </Button>
        </div>
      </main>
    );
  }

  const { booking, flight, travellers, selectedAdults } = state;

  const baseFare = Number(booking.totalCost);
  const convenienceFee = 0;
  const totalFare = baseFare + convenienceFee;

  const departure = new Date(flight.departureTime);
  const arrival = new Date(flight.arrivalTime);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const handleMakePayment = async () => {
    if (isPaying) return;

    const userId = getLoggedInUserId();

    if (userId === null) {
      setPaymentError("Your session has expired. Please log in again.");
      return;
    }

    if (!state.contact?.email) {
      setPaymentError(
        "Traveller email is missing. Please go back and add contact information.",
      );
      return;
    }

    setIsPaying(true);
    setPaymentError("");

    try {
      const response = await makePayment({
        bookingId: state.booking.id,
        userId,
        totalCost: Number(state.booking.totalCost),
        email: state.contact.email,
      });

      if (response.success === false) {
        throw new Error(response.message || "Payment failed.");
      }

      setShowSuccessModal(true);
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again.",
      );
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto min-h-screen w-full max-w-[752px] bg-slate-50">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-slate-200 bg-white px-5 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="text-2xl leading-none"
          >
            ←
          </button>

          <h1 className="text-lg font-semibold">Pay and book</h1>
        </header>

        <div className="space-y-8 px-4 py-4 sm:px-5">
          {/* Fare summary */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold">
                    ₹{totalFare.toLocaleString("en-IN")}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    ₹{baseFare.toLocaleString("en-IN")} base fare
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFareBreakup((current) => !current)}
                  className="text-sm font-medium text-blue-600"
                >
                  {showFareBreakup ? "Hide breakup" : "Fare breakup"}
                </button>
              </div>

              {showFareBreakup && (
                <div className="mt-4 space-y-3 border-t border-dashed border-slate-200 pt-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-600">
                      Base fare ({travellers} traveller
                      {travellers > 1 ? "s" : ""})
                    </span>
                    <span>₹{baseFare.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-600">Convenience fee</span>
                    <span>₹{convenienceFee.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between border-t border-slate-200 pt-3 font-semibold">
                    <span>Total payable</span>
                    <span>₹{totalFare.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}

              <div className="my-4 border-t border-dashed border-slate-200" />

              {/* Flight summary */}
              <div className="flex items-center gap-4">
                <span className="text-3xl" aria-hidden="true">
                  ✈
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {flight.departureAirport.cityDetails.name} →{" "}
                    {flight.arrivalAirport.cityDetails.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(departure)} · {travellers} traveller
                    {travellers > 1 ? "s" : ""}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {flight.flightNumber} · {formatTime(departure)} –{" "}
                    {formatTime(arrival)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-600 px-4 py-3 text-sm font-medium text-white">
              Booking created successfully · Reference #{booking.id}
            </div>
          </section>

          {/* Travellers */}
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold">Traveller details</h2>

            <div className="mt-3 space-y-3">
              {selectedAdults.map((adult) => (
                <div key={adult.id} className="flex items-center gap-3 text-sm">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100">
                    {adult.firstName.charAt(0).toUpperCase()}
                  </span>

                  <span>
                    {adult.firstName} {adult.lastName}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Payment action */}
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Complete your booking</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your booking record has been created. Online payment will be
              available once the payment flow is integrated.
            </p>

            <Button
              type="button"
              className="mt-5 w-full"
              loading={isPaying}
              disabled={isPaying}
              onClick={handleMakePayment}
            >
              {isPaying
                ? "Processing payment..."
                : `Make payment · ₹${totalFare.toLocaleString("en-IN")}`}
            </Button>
{/* 
            {paymentError && (
              <p
                role="alert"
                className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
              >
                {paymentError}
              </p>
            )} */}
          </section>
        </div>
      </div>
      {showSuccessModal && (
        <Modal
          onClose={() => setShowSuccessModal(false)}
          className="fixed left-1/2 top-1/2 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
              ✓
            </div>

            <h2 className="mt-4 text-xl font-bold">Payment successful!</h2>

            <p className="mt-2 text-sm text-slate-600">
              Your booking has been confirmed successfully.
            </p>

            <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
              Booking reference: <strong>#{state.booking.id}</strong>
            </p>

            <p className="mt-3 text-xs text-slate-500">
              A confirmation email will be sent to {state.contact?.email}.
            </p>

            <Button
              type="button"
              className="mt-5 w-full"
              onClick={() => navigate("/flight-search")}
            >
              Back to flight search
            </Button>
          </div>
        </Modal>
      )}

      {paymentError && (
        <Modal
          onClose={() => setPaymentError("")}
          className="fixed left-1/2 top-1/2 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-100 text-3xl text-rose-600">
              !
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Payment unsuccessful
            </h2>

            <p role="alert" className="mt-2 text-sm leading-6 text-slate-600">
              {paymentError}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Your booking could not be confirmed. Please search for a flight
              and try again.
            </p>

            <Button
              type="button"
              className="mt-5 w-full"
              onClick={() => navigate("/flight-search", { replace: true })}
            >
              Book Another Flight
            </Button>

            <button
              type="button"
              className="mt-3 text-sm font-medium text-slate-500 hover:text-slate-800"
              onClick={() => setPaymentError("")}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
