"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { CheckCircle2, Clock3, FileImage, XCircle } from "lucide-react";
import { PageWrapper } from "@/components/common/PageWrapper";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useContent } from "@/hooks/useContent";

export default function PrincipalDashboardPage() {
  const { items, loading, error, fetchAllContent } = useContent();

  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter((item) => item.status === "pending").length,
    approved: items.filter((item) => item.status === "approved").length,
    rejected: items.filter((item) => item.status === "rejected").length
  }), [items]);

  return (
    <PageWrapper
      title="Principal Dashboard"
      description="Monitor broadcast inventory and review pending teacher submissions."
      action={<Button asChild><Link href="/principal/approvals">Review Pending</Link></Button>}
    >
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />)}</div>
      ) : null}
      {!loading && error ? <Card><CardContent className="p-6 text-red-600">{error}</CardContent></Card> : null}
      {!loading && !error ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={FileImage} label="Total" count={stats.total} variant="teal" />
          <StatCard icon={Clock3} label="Pending" count={stats.pending} variant="amber" />
          <StatCard icon={CheckCircle2} label="Approved" count={stats.approved} variant="green" />
          <StatCard icon={XCircle} label="Rejected" count={stats.rejected} variant="red" />
        </div>
      ) : null}
    </PageWrapper>
  );
}
