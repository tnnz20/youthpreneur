import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Youthpreneur</h1>
      <p className="text-muted-foreground">Vite + React + TypeScript.</p>
      <Link className="underline" to="/about">
        About
      </Link>
    </main>
  );
}
