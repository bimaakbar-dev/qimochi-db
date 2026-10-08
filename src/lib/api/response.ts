// src/lib/api/response.ts
//
// Helper standar untuk semua endpoint /api/v1/*.
// Cache & CORS diatur di public/_headers, bukan di sini.

export const API_VERSION = 'v1';

export interface ApiMeta {
  version: string;
  total: number;
  generatedAt: string;
  [key: string]: unknown;
}

export interface ApiSuccess<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    status: number;
  };
}

const BASE_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-API-Version': API_VERSION,
};

export function jsonResponse<T>(
  data: T,
  extraMeta: Record<string, unknown> = {}
): Response {
  const total = Array.isArray(data) ? data.length : 1;

  const body: ApiSuccess<T> = {
    data,
    meta: {
      version: API_VERSION,
      total,
      generatedAt: new Date().toISOString(),
      ...extraMeta,
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: BASE_HEADERS,
  });
}

export function errorResponse(
  code: string,
  message: string,
  status = 400
): Response {
  const body: ApiError = {
    error: { code, message, status },
  };

  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: BASE_HEADERS,
  });
}

export function corsPreflightResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: BASE_HEADERS,
  });
}