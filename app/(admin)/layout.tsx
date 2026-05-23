'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppShell } from '@/components/layout/AppShell';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard adminOnly>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
