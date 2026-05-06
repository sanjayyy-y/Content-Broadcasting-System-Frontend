"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDateTime, getScheduleStatus } from "@/lib/utils";

export function PreviewModal({ item, open, onOpenChange }) {
  if (!item) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>{item.subject} by {item.teacherName}</DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
          <img src={item.fileUrl} alt={item.title} className="h-full w-full object-cover" />
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div><span className="text-muted-foreground">Start:</span> {formatDateTime(item.startTime)}</div>
          <div><span className="text-muted-foreground">End:</span> {formatDateTime(item.endTime)}</div>
          <div><span className="text-muted-foreground">Rotation:</span> {item.rotationDuration}s</div>
          <div className="flex gap-2"><StatusBadge status={item.status} /><StatusBadge status={getScheduleStatus(item.startTime, item.endTime)} /></div>
        </div>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </DialogContent>
    </Dialog>
  );
}
