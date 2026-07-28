export interface CurrentUser {
  user: {
    id: string;
    email?: string | null;
    customerId: string;
    groups: string[];
    firstName?: string;
    lastName?: string;
  };
};

export interface UsersByCustomer {
    id: number;
    name: string;
    customerId: number | null;
    email: string | null;
}

export interface UserId {
  id: number,
  name?: string,
  customerId: number 
}