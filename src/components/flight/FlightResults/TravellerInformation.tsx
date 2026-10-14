import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SearchedFlight } from "../../../common/types/flight";
import { getLoggedInUserEmail } from "../../../common/auth/authStorage";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";
import { Modal } from "../../../components/common/Modal";
import { createBooking } from "../../../common/api/bookingApi";
import { getLoggedInUserId } from "../../../common/auth/authStorage";

interface TravellersInformationState {
  flight: SearchedFlight;
  travellers: number;
}

interface Adult {
  id: number;
  firstName: string;
  lastName: string;
  gender: "Male";
}

interface ContactInformation {
  email: string;
  phone: string;
}

export default function TravellersInformation() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as TravellersInformationState | null;

  const [adults, setAdults] = useState<Adult[]>([]);

  const [selectedAdultIds, setSelectedAdultIds] = useState<number[]>([]);

  const [showAdultModal, setShowAdultModal] = useState(false);

  const [showContactModal, setShowContactModal] = useState(false);

  const [adultFirstName, setAdultFirstName] = useState("");
  const [adultLastName, setAdultLastName] = useState("");

  const [adultFirstNameError, setAdultFirstNameError] = useState("");
  const [adultLastNameError, setAdultLastNameError] = useState("");

  const [contact, setContact] = useState<ContactInformation | null>(null);

  const [email, setEmail] = useState(() => getLoggedInUserEmail() ?? "");
  const [phone, setPhone] = useState("");

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [continueError, setContinueError] = useState("");

  const [showReviewModal, setShowReviewModal] = useState(false);

  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  if (!state) {
    return (
      <main className="min-h-screen bg-white px-4 py-6">
        <div className="mx-auto max-w-[752px]">
          <p className="text-center text-slate-600">
            Traveller information is not available.
          </p>

          <div className="mx-auto mt-4 max-w-xs">
            <Button
              type="button"
              onClick={() => navigate("/flight-search/travel")}
            >
              Back to flights
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const { flight, travellers } = state;

  const totalFare = flight.price * travellers;

  const departure = new Date(flight.departureTime);
  const arrival = new Date(flight.arrivalTime);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const formatTravelDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const durationInMinutes = Math.max(
    0,
    Math.round((arrival.getTime() - departure.getTime()) / 60000),
  );

  const duration = `${Math.floor(durationInMinutes / 60)}h ${
    durationInMinutes % 60
  }m`;

  const selectedAdults = adults.filter((adult) =>
    selectedAdultIds.includes(adult.id),
  );

  const openAdultModal = () => {
    setAdultFirstName("");
    setAdultLastName("");
    setAdultFirstNameError("");
    setAdultLastNameError("");
    setShowAdultModal(true);
  };

  const handleAdultSelection = (adultId: number) => {
    if (travellers === 1) {
      setSelectedAdultIds([adultId]);
      return;
    }

    setSelectedAdultIds((currentIds) => {
      if (currentIds.includes(adultId)) {
        return currentIds.filter((id) => id !== adultId);
      }

      if (currentIds.length >= travellers) {
        return currentIds;
      }

      return [...currentIds, adultId];
    });
  };

  const handleAddAdult = () => {
    let valid = true;

    if (!adultFirstName.trim()) {
      setAdultFirstNameError("First name is required.");
      valid = false;
    } else {
      setAdultFirstNameError("");
    }

    if (!adultLastName.trim()) {
      setAdultLastNameError("Last name is required.");
      valid = false;
    } else {
      setAdultLastNameError("");
    }

    if (!valid) return;

    const newAdult: Adult = {
      id: Date.now(),
      firstName: adultFirstName.trim(),
      lastName: adultLastName.trim(),
      gender: "Male",
    };

    setAdults((current) => [...current, newAdult]);

    // Automatically select the first passenger.
    if (travellers === 1 && adults.length === 0) {
      setSelectedAdultIds([newAdult.id]);
    }
    setShowAdultModal(false);
  };

  const handleSaveContact = () => {
    let valid = true;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!emailPattern.test(email.trim())) {
      setEmailError("Enter a valid email.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!phone.trim()) {
      setPhoneError("Phone number is required.");
      valid = false;
    } else if (!phonePattern.test(phone.trim())) {
      setPhoneError("Enter a valid 10 digit phone number.");
      valid = false;
    } else {
      setPhoneError("");
    }

    if (!valid) return;

    setContact({
      email: email.trim(),
      phone: phone.trim(),
    });

    setShowContactModal(false);
  };

  const handleContinue = () => {
    setContinueError("");

    if (adults.length < travellers) {
      setContinueError(
        `Please add all ${travellers} traveller${
          travellers > 1 ? "s" : ""
        } before continuing.`,
      );
      return;
    }

    if (selectedAdultIds.length !== travellers) {
      setContinueError(
        `Please select ${travellers} traveller${
          travellers > 1 ? "s" : ""
        } before continuing.`,
      );
      return;
    }

    if (!contact) {
      setContinueError("Please add contact information.");
      return;
    }

    console.log("Travellers:", adults);
    console.log("Selected adult:", selectedAdultIds);
    console.log("Contact:", contact);

    // Next page will be added here.
    setShowReviewModal(true);
  };

  const handleConfirmBooking = async () => {
    if (isCreatingBooking) return;

    const userId = getLoggedInUserId();

    if (userId === null) {
      setBookingError("Your session has expired. Please log in again.");
      return;
    }

    setIsCreatingBooking(true);
    setBookingError("");

    try {
      const booking = await createBooking({
        flightId: flight.id,
        userId,
        noOfSeats: selectedAdultIds.length,
      });

      navigate("/flight-search/travel/payment", {
        state: {
          booking,
          flight,
          travellers,
          selectedAdults,
          contact,
        },
      });
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "Unable to create booking. Please try again.",
      );
    } finally {
      setIsCreatingBooking(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[752px] flex-col">
        {/* Header */}
        <header className="flex items-center gap-4 px-0 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-2xl leading-none text-slate-700"
            aria-label="Go back"
          >
            ←
          </button>

          <h1 className="text-[21px] font-semibold">Who's travelling?</h1>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-28">
          {/* Adults */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-semibold">
                Adults{" "}
                <span className="text-sm font-normal text-slate-500">
                  ({adults.length}/{travellers} added)
                </span>
              </h2>

              <button
                type="button"
                onClick={openAdultModal}
                disabled={adults.length >= travellers}
                className="rounded-lg border border-slate-900 px-5 py-2 text-sm font-semibold transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add adult
              </button>
            </div>

            {/* Adult list */}
            <div className="mt-4 space-y-5">
              {adults.map((adult) => {
                const isSelected = selectedAdultIds.includes(adult.id);

                return (
                  <div
                    key={adult.id}
                    className="flex items-center justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => handleAdultSelection(adult.id)}
                      className="flex items-start gap-3 text-left"
                    >
                      {travellers === 1 ? (
                        // Radio
                        <span
                          className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full border-2 ${
                            isSelected ? "border-blue-600" : "border-slate-400"
                          }`}
                        >
                          {isSelected && (
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                          )}
                        </span>
                      ) : (
                        // Checkbox
                        <span
                          className={`mt-0.5 grid h-5 w-5 place-items-center rounded border-2 ${
                            isSelected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-400"
                          }`}
                        >
                          {isSelected && (
                            <span className="text-sm font-bold leading-none">
                              ✓
                            </span>
                          )}
                        </span>
                      )}

                      <span>
                        <span className="block text-base font-medium">
                          {adult.firstName} {adult.lastName}
                        </span>

                        <span className="mt-0.5 block text-xs text-slate-500">
                          {adult.gender}
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="px-2 text-xl text-blue-600"
                      aria-label={`Edit ${adult.firstName}`}
                    >
                      ♢
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Contact Information */}
          <section className="mt-12">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-semibold">
                  Contact Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Booking updates will be shared here
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (contact) {
                    setEmail(contact.email);
                    setPhone(contact.phone);
                  }

                  setShowContactModal(true);
                }}
                className="rounded-lg border border-slate-900 px-5 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                {contact ? "Edit" : "Add Contact"}
              </button>
            </div>

            {contact && (
              <div className="mt-5 space-y-3 text-sm text-slate-800">
                <p className="flex items-center gap-2">
                  <span aria-hidden="true">✉</span>
                  {contact.email}
                </p>

                <p className="flex items-center gap-2">
                  <span aria-hidden="true">⌕</span>
                  {contact.phone}
                </p>
              </div>
            )}
          </section>

          {/* Validation */}
          {continueError && (
            <p
              role="alert"
              className="mt-8 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600"
            >
              {continueError}
            </p>
          )}
        </div>

        {/* Fixed bottom bar */}
        <footer className="fixed bottom-0 left-0 right-0 z-10 border-t border-slate-200 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex w-full max-w-[752px] items-center justify-between gap-5 px-0 py-3">
            <div>
              <p className="text-xl font-bold">
                ₹{totalFare.toLocaleString("en-IN")}
              </p>

              <button
                type="button"
                className="text-xs font-medium text-blue-600"
              >
                View breakup
              </button>
            </div>

            <Button
              type="button"
              onClick={handleContinue}
              className="w-auto max-w-41! text-slate-900"
            >
              Continue
            </Button>
          </div>
        </footer>
      </div>

      {/* Add Adult Modal */}
      {showAdultModal && (
        <Modal
          onClose={() => setShowAdultModal(false)}
          className="fixed left-1/2 top-1/2 w-[min(460px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold">Add new adult</h2>

            <p className="mt-1 text-sm text-slate-500">Above 12 years</p>

            <div className="mt-6 space-y-4">
              <Input
                label="First & middle name"
                placeholder="First & middle name (Given name)"
                value={adultFirstName}
                onChange={(event: any) => setAdultFirstName(event.target.value)}
                error={adultFirstNameError}
                required
              />

              <Input
                label="Last name"
                placeholder="Last name (Surname)"
                value={adultLastName}
                onChange={(event: any) => setAdultLastName(event.target.value)}
                error={adultLastNameError}
              />

              <Button type="button" onClick={handleAddAdult}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <Modal
          onClose={() => setShowContactModal(false)}
          className="fixed left-1/2 top-1/2 w-[min(460px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold">Contact Information</h2>

            <p className="mt-1 text-sm text-slate-500">
              Booking updates will be shared here
            </p>

            <div className="mt-6 space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(event: any) => setEmail(event.target.value)}
                error={emailError}
                required
              />

              <Input
                label="Phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(event: any) => setPhone(event.target.value)}
                error={phoneError}
                maxLength={10}
                required
              />

              <Button type="button" onClick={handleSaveContact}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {showReviewModal && (
        <Modal
          onClose={() => setShowReviewModal(false)}
          className="fixed left-1/2 top-1/2 w-[min(768px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
            {/* Modal heading */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Review your trip</h2>

              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                aria-label="Close review"
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 text-xl hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            {/* Flight details */}
            <section className="rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-lg font-semibold">
                {flight.departureAirport.cityDetails.name} to{" "}
                {flight.arrivalAirport.cityDetails.name}
              </h3>

              <p className="mt-1 text-sm text-slate-700">
                {formatTravelDate(departure)} · {formatTime(departure)} -{" "}
                {formatTime(arrival)}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {duration}, Non-stop
              </p>

              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-100">
                  ✦
                </span>

                <span>
                  {flight.airplaneDetail.modelNumber} · Economy ·{" "}
                  {flight.flightNumber}
                </span>
              </div>
            </section>

            {/* Selected travellers */}
            <section className="mt-8">
              <h3 className="mb-3 text-lg font-semibold">Travellers</h3>

              <div className="space-y-2">
                {selectedAdults.map((adult) => (
                  <p key={adult.id} className="text-sm text-slate-800">
                    {adult.firstName} {adult.lastName}
                  </p>
                ))}
              </div>
            </section>

            {/* Fare */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
              <div>
                <p className="text-sm text-slate-500">Total fare</p>
                <p className="text-lg font-bold">
                  ₹{totalFare.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Confirm */}
            <Button
              type="button"
              variant="secondary"
              loading={isCreatingBooking}
              onClick={handleConfirmBooking}
              className="mt-5 bg-amber-400! text-slate-900! hover:bg-amber-300! focus:ring-amber-300"
            >
              Confirm &amp; proceed
            </Button>
            {bookingError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {bookingError}
              </p>
            )}
          </div>
        </Modal>
      )}
    </main>
  );
}
