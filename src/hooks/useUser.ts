import { useQuery } from "@tanstack/react-query";
import { userService } from "@/service/api/userService";
import { useSession } from "next-auth/react";

export function useUsersByCustomer(customerId: string){

    const { data: session } = useSession();

    const idToken = session?.idToken;

    return useQuery({
        queryKey:['users',customerId],
        queryFn: () => {return userService.client.listUsersByCustomer(customerId, idToken);},
        enabled: !!customerId && !!idToken //Only runs the query if customerId has a value.
    });
}