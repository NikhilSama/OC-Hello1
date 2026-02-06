# Project: Hello World

## Overview
A minimal Next.js application that displays "Hello, World!" — used to test the project-builder workflow.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (minimal)
- **Deployment:** Vercel

## Requirements

### Functional
1. Display "Hello, World!" centered on the page
2. Responsive design (works on mobile and desktop)
3. Clean, minimal UI

### Non-Functional
1. Fast load time (<1s)
2. No external API dependencies
3. Production-ready build

## Phases

### Phase 1: Project Setup [PARALLEL: no]
**Tasks:**
- Initialize Next.js project with TypeScript
- Configure Tailwind CSS
- Set up project structure per CodingStandards.md

**Acceptance Criteria:**
- [ ] `npm run dev` works
- [ ] TypeScript configured with strict mode
- [ ] Tailwind CSS working

### Phase 2: Hello World Page [PARALLEL: no]
**Tasks:**
- Create main page component
- Style with Tailwind (centered, responsive)
- Add basic metadata (title, description)

**Modules:**
- `src/app/page.tsx` - Main page component
- `src/app/layout.tsx` - Root layout

**Unit Tests:**
- Test: Page renders "Hello, World!" text
- Test: Page has correct metadata

**Acceptance Criteria:**
- [ ] "Hello, World!" displays centered
- [ ] Responsive on mobile/desktop
- [ ] All tests pass

## Testing Strategy
- Use Jest + React Testing Library
- Test that main text renders correctly
- Run test → verify → fix loop until pass

## Environment Variables
None required for this simple app.

## Deliverables
1. Working Next.js app
2. Deployed to Vercel
3. GitHub repository (OC_hello-world)
