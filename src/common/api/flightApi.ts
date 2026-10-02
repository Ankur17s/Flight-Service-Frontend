import axios from "axios";
import type {
  FlightSearchParams,
  SearchedFlightApiResponse,
} from "../types/flight";
import apiClient from "./apiClient";

export class FlightApiError extends Error {}

async function fetchFlights(
  params: FlightSearchParams,
): Promise<SearchedFlightApiResponse> {
  try {
    const response = await apiClient.get<SearchedFlightApiResponse>(
      "/flightsService/api/v1/flights",
      {
        params,
        baseURL: import.meta.env.VITE_GATEWAY_BASE_URL ?? "",
      },
    );

    if (!response.data.success) {
      throw new FlightApiError("Unable to load flights. Please try again.");
    }

    return response.data;
  } catch (error) {
    if (error instanceof FlightApiError) throw error;

    if (axios.isAxiosError(error)) {
      throw new FlightApiError("Unable to load flights. Please try again.");
    }

    throw new FlightApiError("Unable to load flights. Please try again.");
  }
}

export function searchFlights(
  params: FlightSearchParams,
): Promise<SearchedFlightApiResponse> {
  return fetchFlights(params);
}
