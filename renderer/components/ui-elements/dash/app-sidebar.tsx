"use client";

import * as React from "react";
import {
  IconHome,
  IconSend,
  IconWallet,
  IconHistory,
  IconSquare,
} from "@tabler/icons-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";


export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="p-4 border-b">
        <span className="font-semibold text-3xl">Axoma</span>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <NavMain />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
