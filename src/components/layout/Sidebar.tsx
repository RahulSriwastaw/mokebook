
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
  Library
} from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BookOpen, label: "Test Series", href: "/tests" },
  { icon: Zap, label: "Practice", href: "/practice" },
  { icon: Library, label: "My Library", href: "/library" },
  { icon: Bot, label: "AI Planner", href: "/study-plans" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-48 border-r h-full bg-white overflow-y-auto shrink-0 relative z-40">
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all group text-[13px] relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "group-hover:text-primary transition-colors")} />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <div className="absolute left-0 w-1 h-4 bg-white rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-[13px]",
            pathname === "/settings" 
              ? "bg-muted text-foreground font-bold" 
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
