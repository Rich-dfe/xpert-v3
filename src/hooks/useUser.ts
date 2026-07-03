import { useQuery } from "@tanstack/react-query";
import { userService } from "@/service/api/userService";

export function useUsersByCustomer(customerId: string){
    return useQuery({
        queryKey:['users',customerId],
        queryFn: () => {return userService.client.listByCustomer(customerId);},
        enabled: !!customerId //Only runs the query if customerId has a value.
    });
}