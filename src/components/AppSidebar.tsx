import { auth } from "@/auth";
import { customerService } from "@/service/api/customerService";
import SidebarClient from "./SidebarClient";
import { isSuperOrAdmin } from "@/lib/helpers";
import { Customer } from "@/types/customer";
import { Session } from "next-auth";

interface AppSidebarProps {
  user: Session["user"];
}

export default async function AppSidebar({user}:AppSidebarProps) {

  if (!user) {
    return null;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  // If user is an admin this means the user is a reseller so we need to return only their customers.
  // If the user is a super-user we return all customers.
  // NOTE: This decision is made on the lambda api using the role in the JWT to determine which customers to retuen 
  /////////////////////////////////////////////////////////////////////////////////////////////
  let customers: Customer[] = [];
  // if (isAdmin(session.user)) {
  //   customers = await customerService.server.listAdminCustomers(session.user.id);
  // } else {
  if (isSuperOrAdmin(user)) {
  customers = await customerService.server.list();
  }
  // }
  return <SidebarClient user={user!} customers={customers} />;
}
