import { cn } from '@/lib/utils';

export const pageWrapper = cn('min-h-screen bg-background');
export const pageMain = cn('container mx-auto px-4 py-8 md:py-10');
export const cardHover = cn(
  'transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5'
);
