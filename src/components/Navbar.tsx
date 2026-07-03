"use client";

import { LogOut, Moon, Settings, User, Sun } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "./ui/sidebar";
import { CurrentUser } from "@/types/user";
import { logout } from "@/app/actions/auth";

const Navbar = ({ user }: CurrentUser) => {
  const { setTheme } = useTheme();

  return (
    <nav className="p-4 flex items-center justify-between border-b border-green-500">
      {/* LEFT SIDE */}
      <SidebarTrigger />
      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        <Link href={"/"}>Dashboard</Link>
        {/* THEME MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* USER MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col">
                <span className="font-medium">{user.email}</span>

                <span className="text-xs text-muted-foreground">
                  {user.groups?.join(", ")}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <form action={logout}>
                <DropdownMenuItem asChild variant="destructive">
                  <button type="submit" className="w-full">
                    <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
                    Logout
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
