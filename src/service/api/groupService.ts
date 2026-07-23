import { apiFetch } from "./client";
import { serverFetch } from "./server";
import { Group } from "@/types/group";

export const groupService = {
    server:{

    },
    client:{
      //list: () => apiFetch<Group[]>("/groups"),
    
    //   listByUserId: (userId: string) =>
    //     apiFetch<Group[]>(`/users/${userId}/groups/`),
    // }

    listGroupsByCustomerIdUserId: (cid: string,uid: string,idToken?:string) =>
        apiFetch<Group[]>(`/customers/${cid}/users/${uid}/groups`,{},idToken),
    }
    
    ///loggers?groupId=${groupId}
}