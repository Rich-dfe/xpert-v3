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
import { useUsersByCustomer } from "@/hooks/useUser";
import { useListGroupsByUser } from "@/hooks/useGroup";
import { useListLoggersByCustomerUser, useListLoggersByCustomerUserGroup } from "@/hooks/useLogger";
import { isSuperOrAdmin } from "@/lib/helpers";
import { useSelection } from "@/context/SelectionContext";


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

//------------------------------------------------------

interface SidebarClientProps {
  user: CurrentUser["user"];
  customers: Customer[];
}

const SidebarClient = ({user, customers}: SidebarClientProps) => {
//The customerid can be from the customer drop down menu.
//THIS NEEDS TO BE DEPENDENT ON THE USER ROLE
const {
  selectedCustomerId,
  setSelectedCustomerId,
  selectedUserId,
  setSelectedUserId,
  selectedGroupId,
  setSelectedGroupId,
  selectedLoggerId,
  setSelectedLoggerId,
} = useSelection();

// ------------- SELECT HANDLERS ---------------------
const handleCustomerChange = (
  e: React.ChangeEvent<HTMLSelectElement>
) => {
  setSelectedCustomerId(e.target.value);
};

const handleUserChange = (
  e: React.ChangeEvent<HTMLSelectElement>
) => {
  setSelectedUserId(e.target.value);
};

const handleGroupChange = (
  e: React.ChangeEvent<HTMLSelectElement>
) => {
  setSelectedGroupId(e.target.value);
};

const handleLoggerChange = (
  e: React.ChangeEvent<HTMLSelectElement>
) => {
  setSelectedLoggerId(e.target.value);
};

//------------------------------------------------------

  const customerOptions = customers.map((customer:any) => ({
  value: customer.id,
  label: customer.companyName,
}));

// ------ Fetch 'User data based on the selected customer -----------------
const { data: users = [], isLoading: isUsersLoading, isError: isUsersError, error: usersError} = useUsersByCustomer(selectedCustomerId);
//Map user data for select menu attributes
const userOptions = users.map((user:any) => ({
  value: user.id,
  label: user.name,
}));
// -------------------------------------------------------------------------

// --------- Fetch 'Group' data based on the selected user -----------------

//If the user has a normal 'user' role set the userId for the groups data to their auth id (user id from xpert RDS).
//Else set it to the userId determioned by the 'Users' select menu which is only available to admin or super-user roles
const effectiveUserId = isSuperOrAdmin(user) ? selectedUserId : user.id;
const { data: groups = [], isLoading: isGroupsLoading, isError: isGroupsError, error: groupsError} = useListGroupsByUser(selectedCustomerId,effectiveUserId);

//Add this option to the 'Groups' select menu to give the user an option to view all their loggers without filtering by group.
const allGroup = {
  id: -1,
  userId: 0,
  groupName: "Show all loggers",
  notes: "A group of all loggers"
};

const updatedGroups = [allGroup,...groups,];

//Map user data for select menu attributes
const groupOptions = updatedGroups.map((group:any) => ({
  value: group.id,
  label: group.groupName,
}));

// -------------------------------------------------------------------------

// --------- Fetch 'Logger' data based on the selected user -----------------

//If the group id >= 0 fetch the loggers belonging to the selected group.
//else fetch all loggers belonging to the selected user 

//If a group is selected: isGroup = true. 
const isGroup = Number(selectedGroupId) >= 0;

const { data: groupData, isLoading: isGroupLoading } = useListLoggersByCustomerUserGroup(selectedCustomerId, selectedUserId,selectedGroupId, { enabled: isGroup });
const { data: userData, isLoading: isUserLoading } = useListLoggersByCustomerUser(selectedCustomerId, selectedUserId,selectedGroupId, { enabled: !isGroup });

// Determine the unified loading state based on which query is active
const isLoggersLoading = isGroup ? isGroupLoading : isUserLoading;

// 3. Map the data directly out of whichever query is active
const loggerOptions = isGroup
  ? ((groupData || []) as any[]).map((logger: any) => ({
      value: logger.id,
      label: logger.loggerName,
    }))
  : ((userData || []) as any[]).map((logger: any) => ({
      value: logger.id,
      label: logger.loggerName, // Map user data for select menu attributes here
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
          {isSuper(user) && <span>super-user -{selectedCustomerId} - {selectedUserId} - {selectedGroupId} - {selectedLoggerId}</span>}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
      {/* Only show the customers and users select menus if the user is an admin or super user */}
      {isSuperOrAdmin(user) && <DropdownBox label="Customers" options={customerOptions} onChange={handleCustomerChange} placeholder="Select Customer"/>}
      {isSuperOrAdmin(user) && <DropdownBox label={isUsersLoading ? "Loading..." : "Users"} options={userOptions} onChange={handleUserChange} placeholder="Select User"/>}
      <DropdownBox label={isGroupsLoading ? "Loading..." : "Groups"} options={groupOptions} onChange={handleGroupChange} placeholder="Select Group"/>
      <DropdownBox label={isLoggersLoading ? "Loading..." : "Loggers"} options={loggerOptions} onChange={handleLoggerChange} placeholder="Select Logger"/>
        
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
