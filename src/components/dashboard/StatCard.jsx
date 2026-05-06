"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const variants = {
  teal: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-200",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  red: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200"
};

function StatCardComponent({ icon: Icon, label, count, variant = "teal" }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-md", variants[variant])}>
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{count}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export const StatCard = React.memo(StatCardComponent);
