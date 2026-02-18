PORT ?= 3000

.PHONY: help web web-dev file-server static-build static-serve

help:
	@printf "Targets:\n"
	@printf "  web          Start the Next.js dev server (no .env loading)\n\n"
	@printf "  web-dev      Start the Next.js dev server (loads ./.env if present)\n\n"
	@printf "  static-build Build static export to app/out (loads ./.env if present)\n\n"
	@printf "  static-serve Build static export and serve preview locally\n\n"
	@printf "  file-server  Start the Nginx file server (local-test-nginx profile)\n\n"
	@printf "Usage:\n"
	@printf "  make web [PORT=3000]\n"
	@printf "  make web-dev [PORT=3000]\n"
	@printf "  make static-build\n"
	@printf "  make static-serve [PORT=3000]\n"
	@printf "  make file-server [OUTPUT_DIR=../data]\n"

web:
	@cd app && npm run dev -- -p $(PORT)

web-dev:
	@set -a; \
	if [ -f ./.env ]; then . ./.env; fi; \
	set +a; \
	cd app && npm run dev -- -p $(PORT)

static-build:
	@set -a; \
	if [ -f ./.env ]; then . ./.env; fi; \
	set +a; \
	cd app && npm run build

static-serve: static-build
	@mkdir -p app/.preview/LANDINGPAGE
	@cp -R app/out/. app/.preview/LANDINGPAGE/
	@cd app/.preview && python3 -m http.server $(PORT)

file-server:
	@docker compose -f docker/docker-compose.yml --profile local-test-nginx up file-server
