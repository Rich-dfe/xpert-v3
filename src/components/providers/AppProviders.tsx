import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { SelectionProvider } from "@/context/SelectionContext";

export function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
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
  );
}