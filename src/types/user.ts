export interface CurrentUser {
  user: {
    id?: string;
    email?: string | null;
    groups?: string[];
  };
};

export interface UsersByCustomer {
    id: number;
    name: string;
    customerId: number | null;
    email: string | null;
}