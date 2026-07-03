'use client';

import { Settings, Home, Inbox } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DropdownBox } from "./DropdownBox";
import Image from "next/image";
import Link from "next/link";
import { CurrentUser } from "@/types/user";
import { isSuper } from "@/lib/helpers";
import { Customer } from "@/types/customer";
import { useState } from "react";
import { useUsersByCustomer } from "@/hooks/useUser";
import { useListGroupsByUser } from "@/hooks/useGroup";


//Menu items
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Config",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Reports",
    url: "/",
    icon: Settings,
  },
  {
    title: "Licenses",
    url: "/",
    icon: Settings,
  },
  {
    title: "Help",
    url: "/",
    icon: Settings,
  },
];

const groupOptions = [
{
  value: "1",
  label: "Paddock1",
},
{
  value: "2",
  label: "Paddock2",
}
];

const loggerOptions = [
{
  value: "1",
  label: "PAR - ABCD123456",
},
{
  value: "2",
  label: "Water Level 2 ",
}
];

//------------------------------------------------------

interface SidebarClientProps {
  user: CurrentUser["user"];
  customers: Customer[];
}

const SidebarClient = ({user, customers}: SidebarClientProps) => {
//The customerid from the customer drop down menu.
//THIS NEEDS TO BE DEPENDENT ON THE USER ROLE
const [customerId, setCustomerId] = useState("");
const [userId, setUserId] = useState("");
const [groupId, setGroupId] = useState("");

const handleCustomerChange = (
  e: React.ChangeEvent<HTMLSelectElement>
) => {
  setCustomerId(e.target.value);
};

const handleUserChange = (
  e: React.ChangeEvent<HTMLSelectElement>
) => {
  setUserId(e.target.value);
};

const handleGroupChange = (
  e: React.ChangeEvent<HTMLSelectElement>
) => {
  setGroupId(e.target.value);
};

  const customerOptions = customers.map((customer:any) => ({
  value: customer.id,
  label: customer.companyName,
}));

const { data: users = [], isLoading: isUsersLoading, isError: isUsersError, error: usersError} = useUsersByCustomer(customerId);
//Map user data for select menu attributes
const userOptions = users.map((user:any) => ({
  value: user.id,
  label: user.name,
}));

const { data: groups = [], isLoading: isGroupsLoading, isError: isGroupsError, error: groupsError} = useListGroupsByUser(userId);

//Map user data for select menu attributes
const groupOptions = groups.map((group:any) => ({
  value: group.id,
  label: group.groupName,
}));

  return (
    <Sidebar collapsible="icon" className="border-r border-green-500">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuButton asChild>
            <Link href="/">
              <Image
                src="/globe.svg"
                alt="Dataflow Logo"
                width={20}
                height={20}
              />
              <span>Dataflow Systems Ltd</span>
            </Link>
          </SidebarMenuButton>
          {isSuper(user) && <span>super-user -{customerId} - {userId} - {groupId}</span>}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
      <DropdownBox label="Customers" options={customerOptions} onChange={handleCustomerChange} placeholder="Select Customer"/>
      <DropdownBox label={isUsersLoading ? "Loading" : "Users"} options={userOptions} onChange={handleUserChange} placeholder="Select User"/>
      <DropdownBox label={isGroupsLoading ? "Loading" : "Groups"} options={groupOptions} onChange={handleGroupChange} placeholder="Select Group"/>
      <DropdownBox label="Loggers" options={loggerOptions} placeholder="Select Logger"/>
        
        <SidebarGroup />
        <SidebarGroupLabel>My Loggers</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default SidebarClient;
