"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusClasses = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  scheduled: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  expired: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
};

function StatusBadgeComponent({ status, className }) {
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
  return <Badge className={cn(statusClasses[status] || "bg-muted text-muted-foreground", className)}>{label}</Badge>;
}

export const StatusBadge = React.memo(StatusBadgeComponent);
