# Component Pulse - AI Development Rules

This document defines the rules and guidelines that AI assistants **MUST** follow when working on the Component Pulse project.

---

## Project Structure

The project consists of two directories:

| Directory | Purpose | Permissions |
|-----------|---------|-------------|
| `/Users/a256/projects/component-pulse/project-template` | Reference template (Minimal UI v7.5.0) | **READ-ONLY** |
| `/Users/a256/projects/component-pulse/component-pulse-frontend` | Working project | **READ/WRITE** |

---

## Critical Rules

### Rule 1: Template is READ-ONLY

**NEVER modify, update, or change any content in the template directory:**
```
/Users/a256/projects/component-pulse/project-template
```

The template serves as a **reference only**. All development work happens in:
```
/Users/a256/projects/component-pulse/component-pulse-frontend
```

---

### Rule 2: Always Consult Template Documentation

Before implementing any feature, **always read the relevant documentation** in:

```
/Users/a256/projects/component-pulse/project-template/docs/
├── AUTH.md           # Authentication (Firebase, JWT) patterns
├── DASHBOARD.md      # E-commerce dashboard widgets & charts
├── LAYOUTS.md        # Layout system (dashboard, main, simple)
└── USER-MANAGEMENT.md # User CRUD, tables, forms, profiles
```

**When to reference which doc:**

| Task Type | Documentation File |
|-----------|-------------------|
| Login, signup, auth guards, session management | `AUTH.md` |
| Dashboard widgets, charts, analytics | `DASHBOARD.md` |
| Page layouts, navigation, headers, sidebars | `LAYOUTS.md` |
| User management, tables, forms, CRUD | `USER-MANAGEMENT.md` |

---

### Rule 3: Check Package Dependencies

Before adding any new dependency, **always check both package.json files**:

1. **Template**: `/Users/a256/projects/component-pulse/project-template/package.json`
2. **Working**: `/Users/a256/projects/component-pulse/component-pulse-frontend/package.json`

**Dependency Installation Rules:**

1. If the dependency **exists in the template**, install the **same version** in the working project
2. If the dependency **does not exist in template**, use the latest stable version
3. Always verify MUI versions match (currently using MUI v7.x)

**Example workflow:**
```bash
# Need to add @mui/x-charts
# 1. Check template package.json - found "@mui/x-charts": "^7.29.1"
# 2. Install same version in working project:
yarn add @mui/x-charts@^7.29.1
```

**Current key versions (template):**
- `@mui/material`: ^7.3.2
- `@mui/x-data-grid`: ^8.12.1
- `@mui/x-date-pickers`: ^8.12.0
- `react`: ^19.1.1
- `next`: ^15.5.4
- `framer-motion`: ^12.23.22
- `react-hook-form`: ^7.63.0
- `zod`: ^4.1.11

---

### Rule 4: Reuse Template Components

Before creating any new component, **always search the template** for existing implementations:

```
/Users/a256/projects/component-pulse/project-template/src/
├── components/       # Reusable UI components
├── sections/         # Feature-specific components
├── layouts/          # Layout components
└── auth/             # Auth components
```

**Component Reuse Workflow:**

1. **Search** the template for existing component
2. **Copy** the component to the working project (preserving directory structure)
3. **Install** any missing dependencies (using template versions)
4. **Adapt** the component if needed (minimal changes)

**Common reusable components in template:**

| Category | Location | Examples |
|----------|----------|----------|
| UI Components | `src/components/` | `label/`, `iconify/`, `scrollbar/`, `image/`, `animate/`, `hook-form/`, `custom-dialog/`, `chart/`, `table/` |
| Layout Components | `src/layouts/components/` | `account-drawer`, `notifications-drawer`, `searchbar`, `settings-button` |
| Auth Components | `src/auth/components/` | `form-head`, `form-socials`, `form-divider` |
| Section Components | `src/sections/` | User tables, product cards, dashboard widgets |

---

### Rule 5: Follow Template Patterns

When implementing features, **follow the patterns established in the template**:

#### File Structure Pattern
```
src/sections/[feature]/
├── view/                    # Page-level views
│   ├── index.ts             # Exports
│   └── [feature]-view.tsx   # Main view component
├── [feature]-item.tsx       # Individual item component
├── [feature]-list.tsx       # List component
└── [feature]-form.tsx       # Form component
```

#### Form Pattern
```tsx
// 1. Define Zod schema
const MySchema = z.object({
  name: z.string().min(1, { error: 'Name is required!' }),
  email: schemaUtils.email(),
});

// 2. Use react-hook-form with zodResolver
const methods = useForm({
  resolver: zodResolver(MySchema),
  defaultValues: { name: '', email: '' },
});

// 3. Use Field components from hook-form
<Form methods={methods} onSubmit={onSubmit}>
  <Field.Text name="name" label="Name" />
  <Field.Text name="email" label="Email" />
</Form>
```

#### Layout Pattern
```tsx
// Dashboard pages
import { DashboardContent } from 'src/layouts/dashboard';

export function MyView() {
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs heading="Title" links={[...]} />
      {/* Content */}
    </DashboardContent>
  );
}
```

---

### Rule 6: Import Path Conventions

Follow the template's import path conventions:

```tsx
// Use absolute imports with 'src/' prefix
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

// Types
import type { IUserItem } from 'src/types/user';
```

---

### Rule 7: Styling Conventions

Follow MUI v7 styling patterns:

```tsx
// Use sx prop for styling
<Box sx={{ p: 3, display: 'flex', gap: 2 }} />

// Use theme.vars for CSS variables
sx={{ color: theme.vars.palette.primary.main }}

// Use responsive values
sx={{ p: { xs: 2, md: 3 } }}

// Use Grid v2 syntax
<Grid size={{ xs: 12, md: 6 }}>
```

---

## Workflow Checklist

Before starting any task, AI assistants should:

- [ ] Read relevant documentation in `project-template/docs/`
- [ ] Check if similar feature exists in template
- [ ] Review template's package.json for dependencies
- [ ] Identify reusable components in template

When implementing:

- [ ] Copy components from template (don't recreate)
- [ ] Use same dependency versions as template
- [ ] Follow template's code patterns and conventions
- [ ] Only modify files in `component-pulse-frontend/`

After completing:

- [ ] Verify no changes were made to template
- [ ] Ensure all imports use correct paths
- [ ] Check that new dependencies match template versions

---

## Quick Reference Commands

```bash
# Working directory
cd /Users/a256/projects/component-pulse/component-pulse-frontend

# Development
yarn dev          # Runs on port 8083

# Add dependency (always check template version first)
yarn add [package]@[version-from-template]

# Type checking
yarn tsc:watch
```

---

## Directory Quick Reference

### Template (READ-ONLY)
```
project-template/
├── docs/                    # Documentation (AUTH, DASHBOARD, LAYOUTS, USER-MANAGEMENT)
├── src/
│   ├── app/                 # Next.js pages
│   ├── auth/                # Auth system
│   ├── components/          # Reusable components
│   ├── layouts/             # Layout system
│   ├── sections/            # Feature sections
│   ├── routes/              # Route paths
│   ├── types/               # TypeScript types
│   └── _mock/               # Mock data
└── package.json             # Reference for dependencies
```

### Working Project (READ/WRITE)
```
component-pulse-frontend/
├── src/                     # All development happens here
├── package.json             # Project dependencies
└── RULES.md                 # This file
```

---

## Summary

1. **Template is READ-ONLY** - Never modify it
2. **Always check docs** - Understand patterns before implementing
3. **Match dependency versions** - Use template versions
4. **Reuse components** - Copy from template, don't recreate
5. **Follow conventions** - Match template's code style
