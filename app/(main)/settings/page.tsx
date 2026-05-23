'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Your account (mock auth)</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Name: </span>
            {user?.displayName}
          </p>
          <p>
            <span className="text-muted-foreground">Email: </span>
            {user?.email}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-muted-foreground">Role: </span>
            <Badge>{user?.role}</Badge>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
