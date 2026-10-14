import axios from "axios";
import apiClient from "./apiClient";

export interface CreateBookingPayload {
  flightId: number;
  userId: number;
  noOfSeats: number;
}

export interface Booking {
  id: number;
  flightId: number;
  userId: number;
  noOfSeats: number;
  totalCost: number;
}

interface CreateBookingResponse {
  success: boolean;
  message: string;
  data: Booking;
  error: unknown;
}

export class BookingApiError extends Error {}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<Booking> {
  try {
    const response = await apiClient.post<CreateBookingResponse>(
      "/bookingService/api/v1/bookings",
      payload,
      {
        baseURL: import.meta.env.VITE_GATEWAY_BASE_URL ?? "",
      },
    );

    if (!response.data.success) {
      throw new BookingApiError(
        response.data.message || "Unable to create booking.",
      );
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof BookingApiError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      throw new BookingApiError(
        error.response?.data?.message ||
          "Unable to create booking. Please try again.",
      );
    }

    throw new BookingApiError("Unable to create booking.");
  }
}