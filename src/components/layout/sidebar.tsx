"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

export function Sidebar({ className, children }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-white",
        className
      )}
    >
      <div className="flex h-full flex-col gap-4 p-4">
        {children}
      </div>
    </aside>
  );
}

interface SidebarNavProps {
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
    active?: boolean;
  }[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            item.active
              ? "bg-arka-blue/10 text-arka-blue"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          )}
        >
          {item.icon}
          {item.title}
        </a>
      ))}
    </nav>
  );
}

export default Sidebar;
