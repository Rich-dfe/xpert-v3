import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function serverFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await auth();

  // tidy this up later once we expose the access token properly
  const accessToken = (session as any)?.accessToken;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "API request failed");
  }

  return response.json() as Promise<T>;
}