import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8',
        className
      )}
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-semibold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
