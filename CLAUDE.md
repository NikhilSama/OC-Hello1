# Claude Code Directives

**Follow all directives in CodingStandards.md for all code generation.**

## Core Requirements

1. **Read CodingStandards.md first** - All code must conform to these standards
2. **Read PRD.md** - Build exactly what is specified in the PRD

## Development Process

### For Each Module/Feature:
1. Write the code following CodingStandards.md
2. Write unit tests (minimum 80% coverage for utilities)
3. Run tests
4. If tests fail: fix and re-run until all pass
5. Do NOT mark module complete until tests pass

### Test-Verify-Fix Loop
```
while (tests_failing) {
  analyze_failure()
  fix_code()
  run_tests()
}
```

## Code Quality Gates

Before marking any phase complete:
- [ ] All unit tests pass
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] No ESLint errors
- [ ] File size limits respected (components < 200 lines)
- [ ] Function size limits respected (< 30 lines)
- [ ] No `any` types used
- [ ] Props properly typed

## Environment Variables

- Use `.env.local` for local development
- Use `.env.example` as template (commit this)
- Access via centralized `/lib/config/env.ts`

## When Unclear

If requirements are ambiguous:
1. Check PRD.md for clarification
2. If still unclear, ask before implementing
3. Do not assume - confirm with user
