
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Flame, 
  Bell, 
  Search, 
  User, 
  Menu, 
  Coins, 
  LogOut, 
  LayoutDashboard,
  Settings,
  BookOpen,
  Bot,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { useUser, useAuth, useDoc, useFirestore } from "@/firebase";
import { signOut } from "firebase/auth";
import { doc } from "firebase/firestore";
import { navItems } from "./Sidebar";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDoc = useDoc(user && db ? doc(db, "users", user.uid) : null);
  const points = userDoc.data?.totalPoints || 0;

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
        router.push("/login");
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shrink-0">
      <div className="container flex h-12 items-center justify-between gap-4 px-4 md:px-6 max-w-full">
        <div className="flex items-center gap-2">
          {user && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[260px]">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-left font-headline font-bold text-primary flex items-center gap-2">
                     <span className="bg-primary text-white p-0.5 rounded-md text-[10px]">M</span>
                     Mockbook
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex-1 p-2 space-y-1">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                          pathname === item.href
                            ? "bg-primary text-primary-foreground font-bold"
                            : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="pt-4 mt-4 border-t space-y-1">
                    <SheetClose asChild>
                      <Link
                        href="/settings"
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium",
                          pathname === "/settings" 
                            ? "bg-muted text-foreground font-bold"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <Settings className="h-4 w-4 shrink-0" />
                        Settings
                      </Link>
                    </SheetClose>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
          <Link href="/" className="flex items-center gap-1.5 font-headline font-bold text-lg tracking-tight text-primary">
            <span className="bg-primary text-white p-0.5 rounded-md text-[10px]">M</span>
            <span className="hidden sm:inline">Mockbook</span>
          </Link>
        </div>

        {user && (
          <div className="hidden md:flex flex-1 max-w-xs relative mx-4">
            <Search className="absolute left-2.5 top-2 h-3 w-3 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search mocks..."
              className="h-7 w-full bg-muted/50 pl-8 rounded-full focus-visible:ring-primary text-[10px]"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/settings" className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 rounded-full border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
                <Coins className="h-3 w-3 text-yellow-600 fill-yellow-600" />
                <span className="font-bold text-yellow-700 text-[10px]">{points.toLocaleString()}</span>
              </Link>

              <div className="hidden xs:flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                <Flame className="h-3 w-3 text-primary fill-primary" />
                <span className="font-bold text-primary text-[10px]">18</span>
              </div>

              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 flex h-1.5 w-1.5 rounded-full bg-accent border border-white"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-muted overflow-hidden border border-primary/20 hover:ring-2 hover:ring-primary/20 transition-all">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="User" className="h-8 w-8 object-cover" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 p-1.5">
                  <div className="p-2 border-b mb-1 bg-primary/5 rounded-t-lg">
                    <p className="font-bold text-xs truncate">{user?.displayName || userDoc.data?.name || "Student"}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{user?.email || "Guest User"}</p>
                  </div>
                  
                  <DropdownMenuItem asChild className="cursor-pointer text-[11px] font-medium rounded-lg">
                    <Link href="/" className="flex items-center gap-2">
                      <LayoutDashboard className="h-3.5 w-3.5 text-primary" /> Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer text-[11px] font-medium rounded-lg">
                    <Link href="/tests/my-series" className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-orange-500" /> My Test Series
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer text-[11px] font-medium rounded-lg">
                    <Link href="/study-plans" className="flex items-center gap-2">
                      <Bot className="h-3.5 w-3.5 text-purple-500" /> AI Study Plans
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer text-[11px] font-medium rounded-lg">
                    <Link href="/practice" className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-yellow-500" /> Practice Sessions
                    </Link>
                  </DropdownMenuItem>

                  <div className="h-px bg-slate-100 my-1 mx-2" />

                  <DropdownMenuItem asChild className="cursor-pointer text-[11px] font-medium rounded-lg">
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-blue-500" /> Profile Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer text-[11px] font-medium rounded-lg">
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-3.5 w-3.5 text-slate-500" /> Billing & Referrals
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleLogout} className="text-destructive font-bold cursor-pointer mt-1 border-t pt-2 rounded-lg text-[11px]">
                    <LogOut className="h-3.5 w-3.5 mr-2" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest bg-primary" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
