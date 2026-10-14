const TOKEN_KEY = "flight_booking_access_token";

export const saveAuthToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export function getLoggedInUserEmail(): string | null {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}

export function hasAuthToken() {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (!payload.exp) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp <= currentTime) {
      clearAuthToken();
      return false;
    }

    return true;
  } catch {
    clearAuthToken();
    return false;
  }
}

export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY);


export function getLoggedInUserId(): number | null {
  const token = getAuthToken();

  if (!token || !hasAuthToken()) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return typeof payload.id === "number" ? payload.id : null;
  } catch {
    return null;
  }
}