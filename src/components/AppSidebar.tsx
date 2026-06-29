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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
//import SidebarSelectMenus from "./SidebarSelectMenus";
import { DropdownBox } from "./DropdownBox";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

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

//-------- TEMPORARY SELECT DATA ---------------------------
const customerOptions = [
{
  value: "1",
  label: "Veldshop",
},
{
  value: "2",
  label: "JCU",
}
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

const AppSidebar = () => {
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
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
      <DropdownBox label="Customers" options={customerOptions}/>
      <DropdownBox label="Groups" options={groupOptions}/>
      <DropdownBox label="Loggers" options={loggerOptions}/>
  
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

export default AppSidebar;
