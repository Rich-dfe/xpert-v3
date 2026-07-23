import { apiFetch } from "./client";
import { serverFetch } from "./server";
import { UsersByCustomer, UserId } from "@/types/user";

export const userService = {
  server: {
    getUserId: (email:string, idToken?:string) => serverFetch<UserId>(`/users/email/${email}`,{},idToken)
  },
  client: {
    //list: () => apiFetch<UsersByCustomer[]>("/groups"),

    listUsersByCustomer: (custId: string, idToken?:string) =>
      apiFetch<UsersByCustomer[]>(`/customers/${custId}/users`,{},idToken),

    //getById: (id: number) => apiFetch<UsersByCustomer>(`/users/groups/${id}`),
  },
};
