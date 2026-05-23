'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FadeIn } from '@/components/motion/FadeIn';
import { MarketingShell } from '@/components/layout/MarketingShell';
import { useAuth } from '@/hooks/use-auth';

type AuthMode = 'login' | 'register';

export function AuthForm({ mode }: { mode: AuthMode }) {
  const { login, register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        login(email, password);
      } else {
        register(email, password, displayName);
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <MarketingShell>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 via-background to-background">
        <FadeIn className="w-full max-w-md">
          <Card className="shadow-soft border-border/80">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Brain className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="font-display text-2xl">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </CardTitle>
              <CardDescription>
                {mode === 'login'
                  ? 'Sign in to continue practicing'
                  : 'First user becomes admin automatically'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Display name</Label>
                    <Input
                      id="name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={4}
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {mode === 'login' ? 'Sign in' : 'Register'}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                {mode === 'login' ? (
                  <>
                    No account?{' '}
                    <Link href="/register" className="text-accent hover:underline">
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    Have an account?{' '}
                    <Link href="/login" className="text-accent hover:underline">
                      Sign in
                    </Link>
                  </>
                )}
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </MarketingShell>
  );
}
