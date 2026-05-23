'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function AnswerInput({
  value,
  onChange,
  maxLength = 5000,
}: {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}) {
  return (
    <div className="space-y-2">
      <Label>Your answer</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="Type your answer here…"
        maxLength={maxLength}
      />
      <p className="text-xs text-muted-foreground text-right">
        {value.length} / {maxLength}
      </p>
    </div>
  );
}
