"use client";

const API_BASE = "https://ecommerce.routemisr.com/api/v1";
const TOKEN_KEY = "freshcart-token";

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export function unwrapApiData(value: unknown): unknown {
  let current = value;
  while (typeof current === "object" && current !== null && !Array.isArray(current)) {
    const record = current as Record<string, unknown>;
    if (!("data" in record)) break;
    current = record.data;
  }
  return current;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken() {
  return typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    token?: string | null;
  } = {},
): Promise<ApiResponse<T>> {
  const token = options.token === undefined ? getToken() : options.token;
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers: {
      ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(token ? { token } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  let payload: unknown;
  const responseBody = await response.text();
  if (!responseBody.trim()) {
    if (!response.ok) {
      throw new ApiError(`Request failed (${response.status}).`, response.status);
    }
    return { data: null as T };
  }

  try {
    payload = JSON.parse(responseBody);
  } catch {
    throw new ApiError("The server returned an unreadable response.", response.status);
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Request failed (${response.status}).`;
    throw new ApiError(message, response.status);
  }

  return payload as ApiResponse<T>;
}
