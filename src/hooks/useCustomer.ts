'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { customerService } from "@/service/api/customerService";

export function useCustomers() {
    return useQuery({
        queryKey: ['customers'],
        queryFn: customerService.server.list,
    });
}

// export function useSaveCustomer() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         // Point directly to the save method in CustomerService
//         mutationFn: (customer: CustomerPayload) => customerService.save(customer),
//         // When AWS Lambda successfully responds, refresh the query cache
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ['customers'] });
//         },
//         onError: (error) =>{
//             console.error("Failed to save customer to Lambda:", error);
//         }
//     });
// }