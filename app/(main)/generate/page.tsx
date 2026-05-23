import { QuestionWizard } from '@/components/generate/QuestionWizard';
import { PageHeader } from '@/components/layout/PageHeader';

export default function GeneratePage() {
  return (
    <div>
      <PageHeader
        title="Generate questions"
        description="Configure your practice session — questions are randomly selected from the 400-question bank"
      />
      <QuestionWizard />
    </div>
  );
}
