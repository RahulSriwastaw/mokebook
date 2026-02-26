
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  Zap, 
  Bot, 
  User,
  Settings,
  Library,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BookOpen, label: "Test Series", href: "/tests" },
  { icon: Zap, label: "Practice", href: "/practice" },
  { icon: Library, label: "My Library", href: "/library" },
  { icon: Bot, label: "AI Planner", href: "/study-plans" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-52 border-r h-full bg-white overflow-y-auto shrink-0 relative z-40 shadow-[1px_0_0_0_hsl(var(--border))]">
      <nav className="flex-1 p-2.5 space-y-0.5 pt-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-sm relative font-medium",
                isActive
                  ? "bg-primary text-white shadow-sm shadow-primary/30 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <div className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-2.5 border-t">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
            pathname === "/settings"
              ? "bg-slate-100 text-slate-900 font-semibold"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          )}
        >
          <Settings className="h-4 w-4 shrink-0 text-slate-400" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
