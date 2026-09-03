import type {
  LoginRequest,
  LoginResponse,
} from "./authTypes";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7133";

async function readResponse(
  response: Response
) {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function login(
  request: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(request),
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data
        ? String(data.message)
        : "Unable to sign in.";

    throw new Error(message);
  }

  return data as LoginResponse;
}

export async function logout(
  sessionId: string
): Promise<void> {
  try {
    await fetch(
      `${API_BASE_URL}/api/auth/logout`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },

        credentials: "include",

        body: JSON.stringify({
          sessionId,
        }),
      }
    );
  } catch {
    // Local session is still cleared by the caller.
  }
}

export async function validateSession(
  sessionId: string
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/session`,
    {
      method: "GET",

      headers: {
        "X-Session-Id": sessionId,
      },

      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Session expired.");
  }

  return response.json();
}