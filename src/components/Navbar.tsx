"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  Home, 
  BookOpen, 
  TrendingUp, 
  LogIn, 
  LogOut,
  Bell,
  Globe,
  LayoutDashboard,
  ShieldAlert,
  Sun,
  Moon,
  Settings,
  User,
  Shield,
  BellRing,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Global Map", href: "/dashboard#map", icon: Globe },
    { name: "Risk Analytics", href: "/dashboard#analytics", icon: ShieldAlert },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "Disease Rate", href: "/disease-rate", icon: TrendingUp },
  ];

  const notifications = [
    { id: 1, title: "Model Sync Complete", time: "2m ago", type: "success" },
    { id: 2, title: "New Delhi Cluster Update", time: "15m ago", type: "info" },
    { id: 3, title: "Mobility Delta Detected", time: "1h ago", type: "warning" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary tracking-tighter shrink-0">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <span className="hidden lg:inline">EpiGuard AI</span>
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-muted whitespace-nowrap",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-primary" />
            )}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-xl relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-2xl overflow-hidden border-border bg-card" align="end">
              <div className="p-4 bg-muted/30 border-b border-border">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <BellRing className="h-4 w-4 text-primary" />
                  System Notifications
                </h4>
              </div>
              <div className="max-h-[300px] overflow-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-foreground">{n.title}</span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{n.time}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Sector Status: {n.type}</p>
                  </div>
                ))}
              </div>
              <div className="p-2">
                <Button variant="ghost" className="w-full text-xs font-bold h-9 rounded-xl">VIEW ALL ALERTS</Button>
              </div>
            </PopoverContent>
          </Popover>

          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-xl"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="rounded-l-[2rem] border-l-border bg-background">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-black tracking-tight text-primary flex items-center gap-3">
                  <Settings className="h-6 w-6" />
                  System Settings
                </SheetTitle>
                <SheetDescription className="font-medium text-muted-foreground">
                  Configure predictive modeling and sector access parameters.
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <Shield className="h-3 w-3" /> Security & Access
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                      <div className="space-y-0.5">
                        <Label className="font-bold text-sm">Two-Factor Auth</Label>
                        <p className="text-[10px] text-muted-foreground font-medium">Require biometric token for policy changes.</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <BellRing className="h-3 w-3" /> Alert Thresholds
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                      <div className="space-y-0.5">
                        <Label className="font-bold text-sm">R_t Critical Alert</Label>
                        <p className="text-[10px] text-muted-foreground font-medium">Notify when reproduction rate exceeds 1.2.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                   <div className="flex items-start gap-4">
                      <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-primary">Sector Node Alpha-4</p>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                          This terminal is connected to the Global Health Intelligence Network. Changes here affect regional forecast models.
                        </p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-6 right-6 space-y-3">
                <Button className="w-full rounded-2xl h-12 font-bold gap-2">
                  <User className="h-4 w-4" />
                  ACCOUNT DASHBOARD
                </Button>
                <Button variant="outline" className="w-full rounded-2xl h-12 font-bold" onClick={() => toast({ title: "Cache Cleared", description: "Local model artifacts have been purged." })}>
                  CLEAR LOCAL CACHE
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button 
            variant={isLoggedIn ? "outline" : "default"} 
            size="sm"
            className="rounded-xl gap-2 font-bold h-10 px-6 ml-2"
            onClick={() => setIsLoggedIn(!isLoggedIn)}
          >
            {isLoggedIn ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
