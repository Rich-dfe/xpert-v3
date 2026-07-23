import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { SelectionProvider } from "@/context/SelectionContext";
import { SessionProvider } from "next-auth/react";

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
        <SelectionProvider>
          {children}
        </SelectionProvider>
      </QueryProvider>
    </ThemeProvider>
    </SessionProvider>
  );
}