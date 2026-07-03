import { apiFetch } from "./client";
import { serverFetch } from "./server";
import { UsersByCustomer } from "@/types/user";

export const userService = {
  server: {},
  client: {
    list: () => apiFetch<UsersByCustomer[]>("/groups"),

    listByCustomer: (custId: string) =>
      apiFetch<UsersByCustomer[]>(`/customer/${custId}/users`),

    getById: (id: number) => apiFetch<UsersByCustomer>(`/user/groups/${id}`),
  },
};
