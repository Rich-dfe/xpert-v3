import { auth } from "@/auth";

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