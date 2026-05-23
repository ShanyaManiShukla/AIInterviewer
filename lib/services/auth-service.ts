import { STORAGE_KEYS } from '@/lib/storage/keys';
import { getItem, removeItem, setItem } from '@/lib/storage/local-storage';
import type { AuthState, User, UserRole } from '@/lib/types';

interface StoredUser extends User {
  password: string;
}

function getUsers(): StoredUser[] {
  return getItem<StoredUser[]>(STORAGE_KEYS.users, []);
}

function saveUsers(users: StoredUser[]): void {
  setItem(STORAGE_KEYS.users, users);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getAuth(): AuthState | null {
  return getItem<AuthState | null>(STORAGE_KEYS.auth, null);
}

export function getCurrentUser(): User | null {
  return getAuth()?.user ?? null;
}

export function isAuthenticated(): boolean {
  return getAuth() !== null;
}

export function login(email: string, password: string): AuthState {
  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters.');
  }

  const users = getUsers();
  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    const role: UserRole = users.length === 0 ? 'admin' : 'student';
    user = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      displayName: email.split('@')[0],
      role,
      password,
    };
    saveUsers([...users, user]);
  }

  const auth: AuthState = {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
    accessToken: `mock_${crypto.randomUUID()}`,
  };
  setItem(STORAGE_KEYS.auth, auth);
  return auth;
}

export function register(
  email: string,
  password: string,
  displayName: string
): AuthState {
  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters.');
  }
  if (!displayName.trim()) {
    throw new Error('Display name is required.');
  }

  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return login(email, password);
  }

  const role: UserRole = users.length === 0 ? 'admin' : 'student';
  const user: StoredUser = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    displayName: displayName.trim(),
    role,
    password,
  };
  saveUsers([...users, user]);

  const auth: AuthState = {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
    accessToken: `mock_${crypto.randomUUID()}`,
  };
  setItem(STORAGE_KEYS.auth, auth);
  return auth;
}

export function logout(): void {
  removeItem(STORAGE_KEYS.auth);
}
