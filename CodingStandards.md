# Next.js Coding Standards

## Table of Contents
1. [Project Structure](#project-structure)
2. [Modularity & Reusability](#modularity--reusability)
3. [File Size Limits](#file-size-limits)
4. [Function Size Limits](#function-size-limits)
5. [Naming Conventions](#naming-conventions)
6. [Environment Variables](#environment-variables)
7. [Component Guidelines](#component-guidelines)
8. [Type Safety](#type-safety)
9. [Error Handling](#error-handling)
10. [Testing](#testing)
11. [Performance](#performance)
12. [Documentation](#documentation)

## Project Structure

Organize code in a scalable, modular structure:

```
/src
  /app                  # Next.js app router pages
  /components
    /common             # Reusable UI components
    /features           # Feature-specific components
    /layout             # Layout components
  /lib
    /api                # API client functions
    /hooks              # Custom React hooks
    /utils              # Pure utility functions
    /constants          # Constants and configurations
    /types              # TypeScript type definitions
    /services           # Business logic services
  /styles               # Global styles and themes
  /config               # Configuration files
```

## Modularity & Reusability

### Component Design

- **Single Responsibility**: Each component should do one thing well
- **Prop-driven**: Make components configurable through props
- **Composition over inheritance**: Build complex UIs by composing simple components
- **Generic first**: Design components to be reusable before making them specific

```tsx
// ❌ Bad - Too specific
function UserProfileCard({ userId }: { userId: string }) {
  const user = useUser(userId);
  return <div>{user.name}</div>;
}

// ✅ Good - Generic and reusable
function ProfileCard({ name, avatar, bio }: ProfileCardProps) {
  return <div>{name}</div>;
}
```

### Extract Reusable Logic

- Custom hooks for shared logic
- Utility functions for common operations
- Service layers for API interactions

```tsx
// /lib/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

## File Size Limits

### Maximum File Sizes

- **Components**: 200 lines maximum
- **Hooks**: 100 lines maximum
- **Utilities**: 150 lines maximum
- **Pages**: 150 lines maximum (extract logic to components/hooks)
- **Services**: 250 lines maximum

### When to Split Files

If a file exceeds limits:
1. Extract helper functions to utilities
2. Split large components into smaller sub-components
3. Move business logic to custom hooks or services
4. Create separate files for types and constants

```tsx
// ❌ Bad - One large file (300+ lines)
// UserDashboard.tsx with all logic, styles, types

// ✅ Good - Split into multiple files
// UserDashboard.tsx (100 lines)
// UserDashboardHeader.tsx (50 lines)
// UserDashboardStats.tsx (60 lines)
// useUserDashboard.ts (80 lines)
// types.ts (30 lines)
```

## Function Size Limits

### Maximum Function Sizes

- **React Components**: 50 lines maximum
- **Regular functions**: 30 lines maximum
- **Utility functions**: 20 lines maximum
- **API handlers**: 40 lines maximum

### Function Refactoring Rules

- One level of abstraction per function
- Extract nested logic into helper functions
- Use early returns to reduce nesting
- Break complex operations into steps

```tsx
// ❌ Bad - Too long and nested
function processUserData(data: UserData) {
  if (data) {
    if (data.isActive) {
      if (data.permissions) {
        // 40 more lines...
      }
    }
  }
}

// ✅ Good - Small, focused functions
function processUserData(data: UserData) {
  if (!isValidUser(data)) return null;

  const permissions = extractPermissions(data);
  const profile = buildUserProfile(data);

  return { permissions, profile };
}

function isValidUser(data: UserData): boolean {
  return Boolean(data?.isActive && data?.permissions);
}
```

## Naming Conventions

### Components

- PascalCase for component files and names
- Descriptive, noun-based names
- Prefix with feature/domain when appropriate

```
// ✅ Good
UserProfileCard.tsx
PaymentButton.tsx
OrderSummaryTable.tsx
```

### Functions and Variables

- camelCase for functions and variables
- Verb-based names for functions
- Descriptive noun-based names for variables
- Boolean variables prefixed with `is`, `has`, `should`, `can`

```tsx
// ✅ Good
const userData = fetchUser();
const isAuthenticated = checkAuth();
const hasPermission = verifyPermission();

function calculateTotal() {}
function validateInput() {}
function handleSubmit() {}
```

### Constants

- SCREAMING_SNAKE_CASE for true constants
- PascalCase for configuration objects

```tsx
// ✅ Good
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ApiConfig = {
  timeout: 5000,
  retries: 3,
} as const;
```

### Files and Folders

- kebab-case for utility files and folders
- PascalCase for component files
- camelCase for hook files (prefixed with `use`)

```
/components/UserProfile.tsx
/lib/utils/format-date.ts
/lib/hooks/useAuth.ts
/lib/api/user-service.ts
```

## Environment Variables

### File Organization

```
.env.local          # Local development (not committed)
.env.development    # Development defaults (committed)
.env.production     # Production defaults (committed)
.env.example        # Template file (committed)
```

### Naming Convention

- Prefix public variables with `NEXT_PUBLIC_`
- Use SCREAMING_SNAKE_CASE
- Group by domain (API, DATABASE, AUTH, etc.)

```bash
# .env.example

# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql://localhost:5432/mydb
DATABASE_POOL_SIZE=10

# Authentication
AUTH_SECRET=your-auth-secret
NEXT_PUBLIC_AUTH_ENABLED=true

# Third-party Services
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxx

# Feature Flags
NEXT_PUBLIC_FEATURE_NEW_UI=false
```

### Environment Variable Access

Create a centralized config file:

```tsx
// /lib/config/env.ts
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  // API
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL'),
  apiKey: getEnvVar('API_SECRET_KEY'),

  // Database
  databaseUrl: getEnvVar('DATABASE_URL'),

  // Auth
  authSecret: getEnvVar('AUTH_SECRET'),

  // Feature flags
  features: {
    newUI: process.env.NEXT_PUBLIC_FEATURE_NEW_UI === 'true',
  },
} as const;

// Usage
import { env } from '@/lib/config/env';
const response = await fetch(env.apiUrl);
```

## Component Guidelines

### Component Structure

Follow consistent ordering:

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/common';

// 2. Types
interface UserCardProps {
  name: string;
  email: string;
}

// 3. Component
export function UserCard({ name, email }: UserCardProps) {
  // 3a. Hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // 3b. Derived state
  const displayName = name.toUpperCase();

  // 3c. Event handlers
  const handleToggle = () => setIsExpanded(!isExpanded);

  // 3d. Effects
  useEffect(() => {
    // side effects
  }, []);

  // 3e. Early returns
  if (!name) return null;

  // 3f. Render
  return (
    <div>
      <h2>{displayName}</h2>
      <p>{email}</p>
      <Button onClick={handleToggle}>Toggle</Button>
    </div>
  );
}
```

### Server vs Client Components

- Default to Server Components
- Use "use client" only when necessary
- Keep client components small and focused

```tsx
// ✅ Good - Server Component (default)
export default async function UserPage({ params }: Props) {
  const user = await fetchUser(params.id);
  return <UserProfile user={user} />;
}

// ✅ Good - Client Component (only interactive parts)
"use client";
export function LikeButton({ postId }: Props) {
  const [likes, setLikes] = useState(0);
  return <button onClick={() => setLikes(likes + 1)}>Like ({likes})</button>;
}
```

## Type Safety

### TypeScript Best Practices

- Enable strict mode in tsconfig.json
- Avoid `any` - use `unknown` for truly unknown types
- Define interfaces for all props and data structures
- Use type guards for runtime validation

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

```tsx
// ✅ Good type definitions
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

type ApiResponse<T> = {
  data: T;
  error: string | null;
  status: number;
};

// Type guards
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}
```

## Error Handling

### Error Boundaries

```tsx
// /components/common/ErrorBoundary.tsx
"use client";

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### API Error Handling

```tsx
// /lib/api/client.ts
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${env.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Network error');
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}
```

## Testing

### Test File Organization

```
/src/components/UserCard.tsx
/src/components/UserCard.test.tsx
/src/lib/utils/format-date.ts
/src/lib/utils/format-date.test.ts
```

### Testing Standards

- Minimum 80% code coverage for utilities
- Test user interactions, not implementation
- Use meaningful test descriptions

```tsx
// UserCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('UserCard', () => {
  it('displays user name and email', () => {
    render(<UserCard name="John" email="john@example.com" />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('toggles expanded state when clicked', async () => {
    render(<UserCard name="John" email="john@example.com" />);
    const button = screen.getByRole('button', { name: /toggle/i });

    await userEvent.click(button);

    expect(screen.getByText(/expanded/i)).toBeInTheDocument();
  });
});
```

## Performance

### Optimization Techniques

- Use `React.memo()` for expensive components
- Implement lazy loading with `next/dynamic`
- Optimize images with `next/image`
- Use Server Components for static content

```tsx
// Lazy loading
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
});

// Memoization
import { memo } from 'react';

export const ExpensiveComponent = memo(function ExpensiveComponent(props: Props) {
  // expensive rendering
});

// Image optimization
import Image from 'next/image';

<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  priority
/>
```

## Documentation

### Component Documentation

```tsx
/**
 * UserCard displays user information in a card layout.
 *
 * @param name - The user's display name
 * @param email - The user's email address
 * @param onEdit - Optional callback when edit button is clicked
 *
 * @example
 * ```tsx
 * <UserCard
 *   name="John Doe"
 *   email="john@example.com"
 *   onEdit={(id) => console.log('Edit', id)}
 * />
 * ```
 */
export function UserCard({ name, email, onEdit }: UserCardProps) {
  // implementation
}
```

### README Requirements

Every major feature or module should have a README:
- Purpose and overview
- Usage examples
- API documentation
- Dependencies
- Configuration options

## Quick Reference Checklist

- [ ] Files under size limits (components: 200 lines)
- [ ] Functions under size limits (30 lines)
- [ ] Consistent naming conventions followed
- [ ] Environment variables in .env files
- [ ] TypeScript strict mode enabled
- [ ] Error boundaries implemented
- [ ] Components properly memoized
- [ ] Tests written and passing
- [ ] Documentation added
- [ ] No `any` types used
- [ ] Reusable components extracted
- [ ] Props properly typed
