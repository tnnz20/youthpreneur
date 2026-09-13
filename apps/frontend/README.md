# Youthpreneur Frontend

React frontend for Youthpreneur Tapin, a youth entrepreneurship platform for Dinas Pemuda dan Olahraga Kabupaten Tapin.

## Stack

- React v19
- TypeScript v6
- Vite v8
- React Router v8
- Tailwind CSS v4
- shadcn/ui with `base-nova`
- Base UI primitives
- Lucide React icons
- Sonner notifications
- ESLint
- Prettier

## Project Structure

```text
├── public/           # Static assets served from the site root
└── src/
    ├── components/
    │   ├── about/    # About page components
    │   ├── home/     # Home page components
    │   ├── shared/   # Shared layout and site components
    │   └── ui/       # shadcn/ui components
    ├── constants/    # Static content and configuration
    ├── hooks/       # Reusable React hooks
    ├── layouts/     # Shared page layouts
    ├── lib/         # Framework-agnostic utilities
    ├── pages/       # Route-level page components
    ├── types/       # Shared TypeScript types
    ├── app.tsx      # Declarative route definitions
    ├── index.css    # Tailwind v4 theme and global styles
    └── main.tsx     # Application bootstrap
```

`MainLayout` provides shared navigation and footer for public pages. The login page renders outside this layout. Routes use declarative `react-router` configuration.

## Routes

- `/` — Youthpreneur landing page
- `/about` — Youthpreneur and Dispora overview
- `/login` — Login form

## Usage

Run commands from `apps/frontend/`:

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Format source files:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

Run ESLint:

```bash
npm run lint
```

Run TypeScript checks:

```bash
npm run typecheck
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

From project root, equivalent Makefile commands are available:

```bash
make fe-install
make fe-dev
make fe-format
make fe-format-check
make fe-lint
make fe-typecheck
make fe-build
make fe-preview
```

## Design

The frontend follows the Youthpreneur Tapin neo-brutalist editorial design system. Warm cream surfaces, pastel brand accents, solid borders, hard-edge shadows, responsive layouts, and accessible interactive components are defined in the root `DESIGN.md` and `src/index.css`.
