'use client';

import { useEffect, useState } from 'react';
import { HistoryList } from '@/components/history/HistoryList';
import { PageHeader } from '@/components/layout/PageHeader';
import { getHistory } from '@/lib/repositories/history-repository';
import type { HistoryEntry } from '@/lib/types';

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [skillFilter, setSkillFilter] = useState('all');

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const skills = Array.from(new Set(entries.map((e) => e.skill)));

  return (
    <div>
      <PageHeader
        title="Practice history"
        description="Your past sessions and mock interviews"
      />
      <HistoryList
        entries={entries}
        skillFilter={skillFilter}
        onSkillFilter={setSkillFilter}
        skills={skills}
      />
    </div>
  );
}
