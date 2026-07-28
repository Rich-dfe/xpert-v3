const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  suppliedIdToken?: string
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      ...(suppliedIdToken && {
        Authorization: `Bearer ${suppliedIdToken}`,
      }),

      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Session has expired
    // Return something to display a message saying the session has expired. 
    alert("Your session has expired. Please logout and sign in again.");
  }
  
  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();

  return data;
}