"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

function toTitleCase(str?: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function SiteHeader() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading || !isAuthenticated || !user) return null;

  const displayName =
    user.firstName && user.lastName
      ? `${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}`
      : toTitleCase(user.firstName) || "User";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex w-full items-center gap-4 px-4 py-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <h1
          className={cn(
            "font-semibold tracking-tight mr-auto",
            "text-lg sm:text-xl md:text-3xl"
          )}
        >
          Welcome, {displayName}
        </h1>
      </div>
    </header>
  );
}