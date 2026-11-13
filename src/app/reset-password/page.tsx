import { Suspense } from "react";
import { AuthPanel } from "@/components/storefront/auth-panel";

type Props = {
  searchParams: Promise<{ email?: string | string[] }>;
};

export default function ResetPasswordPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-copy">Loading password reset...</div>}>
      <ResetPasswordContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetPasswordContent({ searchParams }: Props) {
  const params = await searchParams;
  const email = Array.isArray(params.email) ? params.email[0] ?? "" : params.email ?? "";
  return <AuthPanel mode="reset" initialEmail={email} />;
}
