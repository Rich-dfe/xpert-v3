import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ApplicationContextProvider } from "@/context/ApplicationContext";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import "leaflet/dist/leaflet.css";

export function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <ApplicationContextProvider>
          {children}
          <Toaster richColors />
        </ApplicationContextProvider>
      </QueryProvider>
    </ThemeProvider>
    </SessionProvider>
  );
}