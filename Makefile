PORT ?= 3000

.PHONY: help web web-dev file-server

help:
	@printf "Targets:\n"
	@printf "  web          Start the Next.js dev server (no .env loading)\n\n"
	@printf "  web-dev      Start the Next.js dev server (loads ./.env if present)\n\n"
	@printf "  file-server  Start the Nginx file server (local-test-nginx profile)\n\n"
	@printf "Usage:\n"
	@printf "  make web [PORT=3000]\n"
	@printf "  make web-dev [PORT=3000]\n"
	@printf "  make file-server [OUTPUT_DIR=../data]\n"

web:
	@cd app && npm run dev -- -p $(PORT)

web-dev:
	@set -a; \
	if [ -f ./.env ]; then . ./.env; fi; \
	set +a; \
	cd app && npm run dev -- -p $(PORT)

file-server:
	@docker compose -f docker/docker-compose.yml --profile local-test-nginx up file-server
