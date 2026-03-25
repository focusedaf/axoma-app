"use client";

import {
  IconLayoutDashboard,
  IconBook,
  IconAlertTriangle,
} from "@tabler/icons-react";

import Link from "next/link";
import { cn } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    title: "Exams",
    url: "/dashboard/exams",
    icon: IconBook,
  },
  {
    title: "Violations",
    url: "/dashboard/violations",
    icon: IconAlertTriangle,
  },
];

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className={cn("gap-5")}>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted transition-colors"
              >
                <Link href={item.url}>
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
