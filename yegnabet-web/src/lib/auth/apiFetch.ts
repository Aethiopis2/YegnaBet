export async function apiFetch(
  url: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(
    options.headers
  );

  headers.set(
    "Authorization",
    `Bearer ${accessToken}`
  );

  return fetch(url, {
    ...options,
    headers,
  });
}