"use client";

import { Radio } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center page-surface px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Radio className="h-6 w-6" />
          </span>
          <div className="text-left">
            <h1 className="text-xl font-semibold">CBS</h1>
            <p className="text-sm text-muted-foreground">Educational broadcast approvals</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
