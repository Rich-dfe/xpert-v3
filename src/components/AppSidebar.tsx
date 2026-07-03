import { auth } from "@/auth";
import { customerService } from "@/service/api/customerService";
import SidebarClient from "./SidebarClient";

export default async function AppSidebar(){
  const session = await auth();
  const customers = await customerService.server.list();

  return (
    <SidebarClient 
      user={session!.user!}
      customers={customers}
    />
  )
}