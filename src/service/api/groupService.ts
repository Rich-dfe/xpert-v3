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

    listByUserId: (custId: string,userId: string) =>
        apiFetch<Group[]>(`/users/groups?custId=${custId}&userId=${userId}`),
    }
    
    ///loggers?groupId=${groupId}
}