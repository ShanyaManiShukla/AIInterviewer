'use client';

import { AdminQuestionTable } from '@/components/admin/AdminQuestionTable';
import { PageHeader } from '@/components/layout/PageHeader';

export default function AdminQuestionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Question bank"
        description="Create, edit, and approve questions (overrides merge with the 400-question curated bank)"
      />
      <AdminQuestionTable />
    </div>
  );
}
