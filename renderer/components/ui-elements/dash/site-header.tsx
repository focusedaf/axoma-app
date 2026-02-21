"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function SiteHeader() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading || !isAuthenticated || !user) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex w-full items-center gap-4 px-4 py-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <h1
          className={cn(
            "font-semibold tracking-tight mr-auto text-black",
            "text-lg sm:text-xl md:text-2xl",
          )}
        >
          Student Dashboard
        </h1>

        <span className="text-sm text-muted-foreground">
          Welcome, {user.name}
        </span>
      </div>
    </header>
  );
}
