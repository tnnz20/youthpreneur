FRONTEND_DIR := apps/frontend

.DEFAULT_GOAL := help
.PHONY: help fe-dev fe-install fe-build fe-lint fe-typecheck fe-format fe-format-check fe-preview

help:
	@echo "Frontend:"
	@echo "  fe-dev          Start frontend dev server"
	@echo "  fe-install      Install frontend dependencies"
	@echo "  fe-build        Build frontend"
	@echo "  fe-lint         Run ESLint"
	@echo "  fe-typecheck    Run TypeScript check"
	@echo "  fe-format       Format frontend files"
	@echo "  fe-format-check Check frontend formatting"
	@echo "  fe-preview      Preview production build"

fe-dev:
	npm --prefix apps/frontend run dev

fe-install:
	npm --prefix apps/frontend install

fe-build:
	npm --prefix apps/frontend run build

fe-lint:
	npm --prefix apps/frontend run lint

fe-typecheck:
	npm --prefix apps/frontend run typecheck

fe-format:
	npm --prefix apps/frontend run format

fe-format-check:
	npm --prefix apps/frontend run format:check

fe-preview:
	npm --prefix apps/frontend run preview
