'use client';

import { Settings, Home, ChartSpline, UserRoundArrowLeft, HatGlasses, HardDriveDownload, CircleQuestionMark, FileOutput, ShieldCog, Blend } from "lucide-react";
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
import type { Session } from "next-auth";
import { isSuper } from "@/lib/helpers";
import { Customer } from "@/types/customer";
import { useUsersByCustomer } from "@/hooks/useUser";
import { useListGroupsByUser } from "@/hooks/useGroup";
import { useListLoggersByCustomerUser, useListLoggersByCustomerUserGroup } from "@/hooks/useLogger";
import { isSuperOrAdmin } from "@/lib/helpers";
import { useApplicationContext } from "@/context/ApplicationContext";
import SessionMonitor from "./SessionMonitor";

//Menu items
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Config",
    url: "/dashboard/loggers/settings/config",
    icon: Settings,
  },
  {
    title: "Charts",
    url: "/dashboard/loggers/data/charts",
    icon: ChartSpline,
  },
  {
    title: "Reports",
    url: "/dashboard/loggers/data/reports",
    icon: FileOutput,
  },
  {
    title: "Groups",
    url: "/dashboard/loggers/manage/groups",
    icon: Blend,
  },
  {
    title: "Licenses",
    url: "/dashboard/loggers/manage/licenses",
    icon: ShieldCog,
  },
  {
    title: "Audit",
    url: "/dashboard/loggers/data/audit",
    icon: HatGlasses,
  },
  {
    title: "Help",
    url: "/dashboard/loggers/admin/help",
    icon: CircleQuestionMark,
  },
  {
    title: "Accounts",
    url: "/dashboard/loggers/manage/accounts",
    icon: UserRoundArrowLeft,
  },
  {
    title: "Server Settings",
    url: "/dashboard/loggers/settings/server",
    icon: HardDriveDownload,
  },
];

//------------------------------------------------------

interface SidebarClientProps {
  user: Session["user"];
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
  selectedLoggerUid,
  setSelectedLoggerUid
} = useApplicationContext();

const effectiveCustomerId = isSuperOrAdmin(user)
  ? selectedCustomerId
  : user.customerId;

const effectiveUserId = isSuperOrAdmin(user)
  ? selectedUserId
  : user.id;

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



//------------------------------------------------------

  const customerOptions = customers.map((customer:any) => ({
  value: customer.id,
  label: customer.companyName,
}));

// ------ Fetch 'User data based on the selected customer -----------------
const { data: users = [], isLoading: isUsersLoading, isError: isUsersError, error: usersError} = useUsersByCustomer(effectiveCustomerId, isSuperOrAdmin(user));
//Check that users is an array and map user data for select menu attributes.
//const userOptions = (Array.isArray(users) ? users : []).map((user: any) => ({
const userOptions = users.map((user: any) => ({
  value: user.id,
  label: user.name,
}));
// -------------------------------------------------------------------------

// --------- Fetch 'Group' data based on the selected user -----------------

//If the user has a normal 'user' role set the userId for the groups data to their auth id (user id from xpert RDS).
//Else set it to the userId determioned by the 'Users' select menu which is only available to admin or super-user roles
const { data: groups = [], isLoading: isGroupsLoading, isError: isGroupsError, error: groupsError} = useListGroupsByUser(effectiveCustomerId, effectiveUserId);

//Add this option to the 'Groups' select menu to give the user an option to view all their loggers without filtering by group.
const allGroup = {
  id: -1,
  userId: 0,
  groupName: "Show all loggers",
  notes: "A group of all loggers"
};

let updatedGroups = groups;
if(groups.length > 0){
  updatedGroups = [allGroup,...groups,];
}


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

const { data: groupData, isLoading: isGroupLoading } = useListLoggersByCustomerUserGroup(effectiveCustomerId, effectiveUserId,selectedGroupId, { enabled: isGroup });
const { data: userData, isLoading: isUserLoading } = useListLoggersByCustomerUser(effectiveCustomerId, effectiveUserId,selectedGroupId, { enabled: !isGroup });

const loggers = isGroup ? groupData : userData;
console.log('LOGGERS',loggers);

const handleLoggerChange = (
  e: React.ChangeEvent<HTMLSelectElement>
) => {
  const loggerId = e.target.value;

  const selectedLogger = loggers?.find(
    logger => logger.id.toString() === loggerId
  );

  setSelectedLoggerId(e.target.value);
  setSelectedLoggerUid(selectedLogger?.loggerUid ?? null);
};

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
          <SessionMonitor />
          {isSuper(user) && <span>super-user -{selectedCustomerId} - {selectedUserId} - {selectedGroupId} - {selectedLoggerId} - {selectedLoggerUid}</span>}
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
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
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
