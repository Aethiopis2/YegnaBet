import axios from "axios";
import { API_BASE } from "../../types/api";
import type {
  LoginRequest,
  LoginResponse,
} from "../../types/auth/authTypes";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5150";



export async function login(request: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await API_BASE.post(`auth/login`, request);
    return response.data;

    } catch (err) {
      if (axios.isAxiosError(err)) {
            throw new Error(
                `${err.name}: ${err.message}`
            );
        }
        
        throw err;
    }
} // end login


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