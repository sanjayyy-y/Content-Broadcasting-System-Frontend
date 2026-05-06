"use client";

import React from "react";
import { Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDateTime, getScheduleStatus } from "@/lib/utils";

function ContentCardComponent({ item, actions, onPreview }) {
  const schedule = getScheduleStatus(item.startTime, item.endTime);

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-muted">
        <img src={item.fileUrl} alt={item.title} className="h-full w-full object-cover" />
      </div>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.subject} • {item.teacherName}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={item.status} />
            <StatusBadge status={schedule} />
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {formatDateTime(item.startTime)}</p>
          <p className="pl-5">{formatDateTime(item.endTime)}</p>
        </div>
        {item.status === "rejected" && item.rejectionReason ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
            {item.rejectionReason}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {onPreview ? (
            <Button variant="outline" size="sm" onClick={() => onPreview(item)}>
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          ) : null}
          {actions}
        </div>
      </CardContent>
    </Card>
  );
}

export const ContentCard = React.memo(ContentCardComponent);
