export interface Customer {
    id: number;
    companyName: string;
    agentId: number | null;
    isAgent: number | null;
}

export interface CreateCustomerRequest {
    companyName: string;
}

export interface UpdateCustomerRequest {
    id: number;
    companyName: string;
}