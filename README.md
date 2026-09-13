# Youthpreneur

Youthpreneur Tapin is a youth entrepreneurship platform for Dinas Pemuda dan Olahraga Kabupaten Tapin. It supports youth data, business incubation, local commodity development, training, mentorship, partnerships, and entrepreneurship resources.

## Tech Stack

### Frontend

- React v19
- TypeScript v6
- Vite v8
- React Router v8

### Backend

- Golang v1.27

## Project Structure

```text
.
├── apps/
│   ├── backend/       # Reserved for the future Go backend
│   └── frontend/      # React frontend application
├── DESIGN.md          # Design system and implementation specification
├── Makefile           # Development command shortcuts
└── README.md
```

## Requirements

- Node.js 22.22 or newer
- npm
- GNU Make

## Usage

Use `make help` to list available development commands:

```bash
make help
```

Install frontend dependencies and start development server:

```bash
make fe-install
make fe-dev
```

The detailed frontend architecture, routes, and frontend commands are documented in [`apps/frontend/README.md`](apps/frontend/README.md).

## Design

The project follows the Youthpreneur Tapin neo-brutalist editorial design system documented in `DESIGN.md`.
