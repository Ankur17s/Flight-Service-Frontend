import axios from "axios";
import type { Airport, AirportApiResponse } from "../types/flight";
import apiClient from "./apiClient";

export class AirportApiError extends Error {}

let airportsRequest: Promise<Airport[]> | null = null;

async function fetchAirports(): Promise<Airport[]> {
  try {
    const response = await apiClient.get<AirportApiResponse>(
      "/flightsService/api/v1/airports",
      {
        // Airport requests are proxied through the gateway's flight-service route.
        // This remains relative in development and can be configured on deployment.
        baseURL: import.meta.env.VITE_GATEWAY_BASE_URL ?? "",
      },
    );

    if (!response.data.success) {
      throw new AirportApiError("Unable to load airports. Please try again.");
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof AirportApiError) throw error;
    if (axios.isAxiosError(error)) {
      throw new AirportApiError("Unable to load airports. Please try again.");
    }
    throw new AirportApiError("Unable to load airports. Please try again.");
  }
}

export function getAirports(): Promise<Airport[]> {
  if (!airportsRequest) {
    airportsRequest = fetchAirports().catch((error: unknown) => {
      airportsRequest = null;
      throw error;
    });
  }

  return airportsRequest;
}
