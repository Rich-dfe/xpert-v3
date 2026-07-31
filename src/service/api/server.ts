import { auth } from "@/auth";
import { signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function serverFetch<T>(
  path: string,
  options: RequestInit = {},
  suppliedIdToken?: string
): Promise<T> {

  const session = suppliedIdToken
    ? null
    : await auth();

  const idToken =
    suppliedIdToken ??
    session?.idToken;

  const headers = {
    "Content-Type": "application/json",

    ...(idToken && {
      Authorization: `Bearer ${idToken}`,
    }),

    ...options.headers,
  };

  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        ...options,
        headers,
      }
    );

  //console.log("#### RESPONSE", response);

  if (response.status === 401) {
    // Session has expired
    // Return something to display a message saying the session has expired. 
    alert("Your session has expired. Please logout and sign in again.");
    signOut();
  }

  if (!response.ok) {
    const message =
      await response.text();

    throw new Error(
      message ||
      "API request failed"
    );
  }

  return response.json() as Promise<T>;
}