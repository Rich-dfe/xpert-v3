import { auth } from "@/auth";
import { customerService } from "@/service/api/customerService";
import SidebarClient from "./SidebarClient";
import { isAdmin } from "@/lib/helpers";

export default async function AppSidebar() {
  const session = await auth();
  //const customers = await customerService.server.list();

  if (!session?.user) {
    return null;
  }

  
  //This is where we determine if the logged in user is an admin or super-user
  //If an admin this means the user is a reseller so we need to return only their customers.
  //If the user is a super-user we return all customers.
  let customers = [];
  if (isAdmin(session.user)) {
    customers = await customerService.server.listByUser(session.user.id);
  } else {
    customers = await customerService.server.list();
  }

  return <SidebarClient user={session!.user!} customers={customers} />;
}
