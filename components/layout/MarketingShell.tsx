'use client';

import Link from 'next/link';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MarketingShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <nav className="border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Brain className="h-8 w-8 text-accent transition-transform group-hover:scale-105" />
            <span className="text-xl font-display font-semibold text-foreground">
              AI Interview Practice
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
