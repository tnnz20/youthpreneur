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
	npm run dev

fe-install:
	npm install

fe-build:
	npm run build

fe-lint:
	npm run lint

fe-typecheck:
	npm run typecheck

fe-format:
	npm run format

fe-format-check:
	npm run format:check

fe-preview:
	npm run preview
