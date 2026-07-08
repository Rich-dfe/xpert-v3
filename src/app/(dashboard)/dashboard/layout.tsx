import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication
  const session = await auth();
  //console.log("SESSION:", session);

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user!;

  // Sidebar state
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";


  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={user}/>

      <main className="w-full">
        <Navbar user={user}/>
        <div className="px-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}