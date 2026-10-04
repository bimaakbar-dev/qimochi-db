// src/lib/api/response.ts

const CACHE_HEADER =
  'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';

const BASE_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': CACHE_HEADER,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
};

export function jsonResponse(
  data: unknown,
  extra: Record<string, unknown> = {}
): Response {
  const body = {
    data,
    meta: {
      total: Array.isArray(data) ? data.length : 1,
      generatedAt: new Date().toISOString(),
      ...extra,
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
  return new Response(
    JSON.stringify(
      {
        error: {
          code,
          message,
          status,
        },
      },
      null,
      2
    ),
    {
      status,
      headers: BASE_HEADERS,
    }
  );
}

export function corsPreflightResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: BASE_HEADERS,
  });
}