import { apiFetch } from "./client";
import { serverFetch } from "./server";
import { Group } from "@/types/group";

export const groupService = {
    server:{

    },
    client:{
      list: () =>
        apiFetch<Group[]>("/groups"),
    
      listByUserId: (userId: string) =>
        apiFetch<Group[]>(`/user/${userId}/groups/`),
    }   
}