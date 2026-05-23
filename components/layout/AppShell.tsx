'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, LogOut, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PageTransition } from '@/components/motion/PageTransition';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { pageMain } from '@/lib/design/cn-page';

const mainNav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/generate', label: 'Generate' },
  { href: '/questions/static', label: 'Question Bank' },
  { href: '/history', label: 'History' },
  { href: '/settings', label: 'Settings' },
];

function NavLink({
  href,
  label,
  pathname,
  onClick,
}: {
  href: string;
  label: string;
  pathname: string;
  onClick?: () => void;
}) {
  const active =
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  return (
    <Link href={href} onClick={onClick}>
      <span
        className={cn(
          'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
          active
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    ...mainNav,
    ...(user?.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle className="font-display text-left">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-6">
                  {links.map((link) => (
                    <NavLink
                      key={link.href}
                      {...link}
                      pathname={pathname}
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Brain className="h-7 w-7 text-accent" />
              <span className="font-display font-semibold text-lg hidden sm:inline">
                AI Interview
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    pathname === link.href ||
                      pathname.startsWith(link.href + '/')
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden lg:inline max-w-[120px] truncate">
              {user?.displayName}
            </span>
            <Link href="/settings" className="hidden sm:block">
              <Button variant="ghost" size="icon" title="Settings">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={logout} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className={pageMain}>
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
