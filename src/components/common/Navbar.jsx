"use client";

import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export function Navbar({ onMenuClick }) {
  const { user, role, logout } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cbs_theme");
    const enabled = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("cbs_theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">Content Broadcasting System</p>
            <h1 className="text-base font-semibold">School Display Console</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle dark mode">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <Badge variant="secondary" className="mt-1 capitalize">
              {role}
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
