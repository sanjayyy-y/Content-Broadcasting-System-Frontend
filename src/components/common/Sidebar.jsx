"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CheckSquare, FileImage, LayoutDashboard, Radio, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const teacherLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: UploadCloud },
  { href: "/my-content", label: "My Content", icon: FileImage }
];

const principalLinks = [
  { href: "/principal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/principal/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/principal/all-content", label: "All Content", icon: BarChart3 }
];

export function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { role, user } = useAuth();
  const links = role === "principal" ? principalLinks : teacherLinks;

  return (
    <>
      <div className={cn("fixed inset-0 z-40 bg-black/45 lg:hidden", open ? "block" : "hidden")} onClick={onClose} />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r bg-card transition-transform lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href={role === "principal" ? "/principal/dashboard" : "/dashboard"} className="flex items-center gap-2 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Radio className="h-5 w-5" />
            </span>
            CBS
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-1 p-4">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  active && "bg-secondary text-secondary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          {role === "teacher" ? (
            <Link
              href={`/live/${user?.id || "t1"}`}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Radio className="h-4 w-4" />
              Public Live
            </Link>
          ) : null}
        </nav>
      </aside>
    </>
  );
}
