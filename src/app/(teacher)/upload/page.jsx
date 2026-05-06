"use client";

import { PageWrapper } from "@/components/common/PageWrapper";
import { UploadForm } from "@/components/forms/UploadForm";

export default function UploadPage() {
  return (
    <PageWrapper title="Upload Content" description="Prepare classroom media and send it for principal approval.">
      <UploadForm />
    </PageWrapper>
  );
}
