"use client";

import { useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";

export function PageWrapper({ title, description, action, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen page-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-normal">{title}</h2>
              {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
            </div>
            {action ? <div>{action}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
