"use client";

import { useEffect, useMemo } from "react";
import { CheckCircle2, Clock3, FileImage, XCircle } from "lucide-react";
import { PageWrapper } from "@/components/common/PageWrapper";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ContentTable } from "@/components/content/ContentTable";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useContent } from "@/hooks/useContent";
import { formatDateTime } from "@/lib/utils";

function TableSkeleton() {
  return <div className="space-y-3">{Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-14 w-full" />)}</div>;
}

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const { items, loading, error, fetchMyContent } = useContent();

  useEffect(() => {
    if (user?.id) fetchMyContent(user.id);
  }, [user?.id, fetchMyContent]);

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter((item) => item.status === "pending").length,
    approved: items.filter((item) => item.status === "approved").length,
    rejected: items.filter((item) => item.status === "rejected").length
  }), [items]);

  const recent = useMemo(() => items.slice(0, 5), [items]);
  const columns = useMemo(() => [
    { key: "title", header: "Title" },
    { key: "subject", header: "Subject" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "createdAt", header: "Created", render: (item) => formatDateTime(item.createdAt) }
  ], []);

  return (
    <PageWrapper title="Teacher Dashboard" description="Track uploads, approvals, and recent broadcast content.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileImage} label="Total Uploaded" count={stats.total} variant="teal" />
        <StatCard icon={Clock3} label="Pending" count={stats.pending} variant="amber" />
        <StatCard icon={CheckCircle2} label="Approved" count={stats.approved} variant="green" />
        <StatCard icon={XCircle} label="Rejected" count={stats.rejected} variant="red" />
      </div>
      <section className="mt-6">
        <h3 className="mb-3 text-lg font-semibold">Recent Content</h3>
        {loading ? <TableSkeleton /> : null}
        {!loading && error ? <Card><CardContent className="p-6 text-red-600">{error}</CardContent></Card> : null}
        {!loading && !error && recent.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No content uploaded yet.</CardContent></Card>
        ) : null}
        {!loading && !error && recent.length > 0 ? <ContentTable columns={columns} data={recent} /> : null}
      </section>
    </PageWrapper>
  );
}
