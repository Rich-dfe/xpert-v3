import { apiFetch } from "./client";
import { serverFetch } from "./server";
import { UsersByCustomer, UserId } from "@/types/user";

export const userService = {
  server: {
    getUserId: (email:string) => serverFetch<UserId>(`/users/email/${email}`)
  },
  client: {
    list: () => apiFetch<UsersByCustomer[]>("/groups"),

    listByCustomer: (custId: string) =>
      apiFetch<UsersByCustomer[]>(`/customer/${custId}/users`),

    getById: (id: number) => apiFetch<UsersByCustomer>(`/users/groups/${id}`),
  },
};
