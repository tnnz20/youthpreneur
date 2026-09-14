# Youthpreneur

Youthpreneur Tapin is a youth entrepreneurship platform for Dinas Pemuda dan Olahraga Kabupaten Tapin.

## Stack

- React v19
- TypeScript v6
- Vite v8
- React Router v8
- Tailwind CSS v4
- Base UI, shadcn/ui, Lucide React, Sonner

## Structure

```text
.
├── public/       # Static assets
├── src/           # React application
├── DESIGN.md     # Design system
├── Makefile      # Development command shortcuts
└── README.md
```

Routes:

- `/` — Youthpreneur landing page
- `/about` — Youthpreneur and Dispora overview
- `/login` — Login form

## Requirements

- Node.js 22.22 or newer
- npm
- GNU Make

## Usage

```bash
make fe-install
make fe-dev
```

Run `make help` for all commands. Direct npm commands run from repository root:

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
npm run build
```

The frontend follows the neo-brutalist editorial design system documented in `DESIGN.md` and `src/index.css`.
