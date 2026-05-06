"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PageWrapper } from "@/components/common/PageWrapper";
import { ContentCard } from "@/components/content/ContentCard";
import { ContentTable } from "@/components/content/ContentTable";
import { PreviewModal } from "@/components/content/PreviewModal";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useContent } from "@/hooks/useContent";
import { formatDateTime, getScheduleStatus } from "@/lib/utils";

export default function MyContentPage() {
  const { user } = useAuth();
  const { items, loading, error, fetchMyContent } = useContent();
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    if (user?.id) fetchMyContent(user.id);
  }, [user?.id, fetchMyContent]);

  const handlePreview = useCallback((item) => setPreviewItem(item), []);

  const columns = useMemo(() => [
    { key: "preview", header: "Preview", render: (item) => <img src={item.fileUrl} alt={item.title} className="h-12 w-20 rounded object-cover" /> },
    { key: "title", header: "Title", render: (item) => <div><p className="font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.subject}</p></div> },
    { key: "status", header: "Status", render: (item) => <div className="flex flex-wrap gap-1"><StatusBadge status={item.status} /><StatusBadge status={getScheduleStatus(item.startTime, item.endTime)} /></div> },
    { key: "time", header: "Start / End", render: (item) => <div className="text-sm"><p>{formatDateTime(item.startTime)}</p><p className="text-muted-foreground">{formatDateTime(item.endTime)}</p></div> },
    { key: "rejectionReason", header: "Rejection Reason", render: (item) => item.rejectionReason ? <span className="text-red-600">{item.rejectionReason}</span> : "—" }
  ], []);

  return (
    <PageWrapper title="My Content" description="Review all content you have submitted for broadcast.">
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-80 w-full" />)}</div>
      ) : null}
      {!loading && error ? <Card><CardContent className="p-6 text-red-600">{error}</CardContent></Card> : null}
      {!loading && !error && items.length === 0 ? <Card><CardContent className="p-8 text-center text-muted-foreground">You haven't uploaded any content yet</CardContent></Card> : null}
      {!loading && !error && items.length > 0 ? (
        <>
          <div className="hidden lg:block"><ContentTable columns={columns} data={items} /></div>
          <div className="grid gap-4 lg:hidden">{items.map((item) => <ContentCard key={item.id} item={item} onPreview={handlePreview} />)}</div>
          <PreviewModal item={previewItem} open={Boolean(previewItem)} onOpenChange={(open) => !open && setPreviewItem(null)} />
        </>
      ) : null}
    </PageWrapper>
  );
}
