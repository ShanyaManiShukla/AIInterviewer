'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
  Code,
  FileText,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingShell } from '@/components/layout/MarketingShell';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerItem, StaggerList } from '@/components/motion/StaggerList';
import { cardHover } from '@/lib/design/cn-page';
import { getSkills } from '@/lib/repositories/catalog-repository';
import { useEffect, useState } from 'react';
import type { Skill } from '@/lib/types';

const features = [
  {
    icon: Brain,
    title: '400 Curated Questions',
    description:
      'Full question bank across 20 software engineering skills with structured model answers.',
    badge: 'Complete bank',
  },
  {
    icon: Code,
    title: 'Multiple Question Types',
    description:
      'Conceptual, coding, scenario, debugging, behavioral, and system-thinking practice.',
    badge: 'Comprehensive',
  },
  {
    icon: MessageSquare,
    title: 'Instant Feedback',
    description:
      'Rubric-based mock scoring with strengths, gaps, and follow-up questions.',
    badge: 'Real-time',
  },
  {
    icon: Clock,
    title: 'Mock Interview Mode',
    description: 'Timed sessions with countdown, per-question timers, and session summaries.',
    badge: 'Realistic',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Dashboard and history to review past sessions and average scores.',
    badge: 'Analytics',
  },
  {
    icon: FileText,
    title: 'PDF Export',
    description: 'Print-optimized session reports for offline review.',
    badge: 'Portable',
  },
];

export default function Home() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    setSkills(getSkills());
  }, []);

  return (
    <MarketingShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.03]" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <FadeIn className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-accent/15 text-accent-foreground border-accent/30">
              <Sparkles className="h-3 w-3 mr-1" />
              20 skills · 400 questions
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-semibold mb-6 leading-tight text-balance">
              Master your technical{' '}
              <span className="text-accent">interview</span> with confidence
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Generate tailored practice sets, run timed mock interviews, and get
              structured feedback — all from a curated software engineering question bank.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 shadow-soft"
                >
                  Start free practice
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign in
                </Button>
              </Link>
            </div>
          </FadeIn>
          <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            {[
              { number: '20', label: 'Skills' },
              { number: '400', label: 'Questions' },
              { number: 'AI', label: 'Mock scoring' },
              { number: '24/7', label: 'Available' },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center p-4 rounded-lg bg-card border border-border shadow-card">
                  <div className="text-3xl font-display font-semibold text-accent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </section>

      <section className="bg-muted/50 py-12 border-y border-border">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground text-center mb-4 uppercase tracking-wider">
            Practice across technologies
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto">
            {skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className="text-sm py-1.5 px-3 cursor-default"
                title={skill.interview_focus}
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for students and developers preparing for technical interviews
          </p>
        </FadeIn>
        <StaggerList className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <Card className={`h-full border-border ${cardHover}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <feature.icon className="h-10 w-10 text-accent" />
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl font-display">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
              How it works
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-12">
              Three steps from practice to interview-ready
            </p>
          </FadeIn>
          <StaggerList className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Choose your focus', desc: 'Pick skill, topic, difficulty, and question types.' },
              { step: '2', title: 'Practice & answer', desc: 'Review sets or run a timed mock interview.' },
              { step: '3', title: 'Get feedback', desc: 'See rubric scores, strengths, and gaps instantly.' },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 text-xl font-display font-semibold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-display font-medium mb-2">{item.title}</h3>
                  <p className="opacity-85 text-sm">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-display font-semibold mb-6">
              Why practice here?
            </h2>
            <ul className="space-y-3">
              {[
                '400 structured questions with model answers',
                '20 skills from JavaScript to System Design',
                'Mock interviews with per-question timers',
                'Session history and printable summaries',
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button size="lg" className="mt-8 bg-primary hover:bg-primary/90">
                Start your journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="bg-accent/10 border-t border-accent/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-semibold mb-4">
            Ready for your next interview?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join and start practicing with the full curated question bank today.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Create free account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground/80 py-10">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} AI Interview Practice</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/login" className="hover:text-accent transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-accent transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </MarketingShell>
  );
}
