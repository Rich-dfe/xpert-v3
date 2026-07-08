import { apiFetch } from "./client";
import { serverFetch } from "./server";
import { Customer } from "@/types/customer";

export const customerService = {
  server: {
    list: () => serverFetch<Customer[]>("/customers"),
    listByUser: (userId: string) => serverFetch<Customer[]>(`/users/customers/${userId}`),
  },
  client: {
    getById: (id: number) => serverFetch<Customer>(`/customers/${id}`),

    //   create: (customer: CreateCustomerRequest) =>
    //     apiFetch<Customer>("/customers", {
    //       method: "POST",
    //       body: JSON.stringify(customer),
    //     }),

    //   update: (id: number, customer: UpdateCustomerRequest) =>
    //     apiFetch<Customer>(`/customers/${id}`, {
    //       method: "PUT",
    //       body: JSON.stringify(customer),
    //     }),

    remove: (id: number) =>
      serverFetch<void>(`/customers/${id}`, {
        method: "DELETE",
      }),
  },
};
