import axios from "axios";
import apiClient from "./apiClient";

export interface MakePaymentPayload {
  bookingId: number;
  userId: number;
  totalCost: number;
  email: string;
}

interface MakePaymentResponse {
  success: boolean;
  message: string;
  data: unknown;
  error: unknown;
}

export class PaymentApiError extends Error {}

export async function makePayment(
  payload: MakePaymentPayload,
): Promise<MakePaymentResponse> {
  try {
    const response = await apiClient.post<MakePaymentResponse>(
      "/bookingService/api/v1/bookings/payments",
      {
        bookingId: payload.bookingId,
        userId: payload.userId,
        totalCost: payload.totalCost,
        email: payload.email,
      },
      {
        baseURL: import.meta.env.VITE_GATEWAY_BASE_URL ?? "",
        headers: {
          "x-idempotency-key": crypto.randomUUID(),
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as
        | {
            message?: string;
            error?: {
              explanation?: string;
            };
          }
        | undefined;

      throw new PaymentApiError(
        responseData?.error?.explanation ||
          responseData?.message ||
          "Payment failed. Please try again.",
      );
    }

    throw new PaymentApiError("Unable to process payment.");
  }
}
