"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../ui-elements/dash/app-sidebar";
import { SiteHeader } from "../ui-elements/dash/site-header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <SiteHeader/>

        <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-50 min-h-screen">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
