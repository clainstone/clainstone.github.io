# Run the site on homelab. Node is installed in ~/.local/node/bin here.
#
#   make start     dev server in the background, reloads on every save
#   make preview   build, then serve dist/ in the background as Pages will
#   make stop      stop whichever of the two is running
#   make status    is a server running?
#   make logs      follow the dev server's log
#   make dev       dev server in the foreground (Ctrl-C to stop)
#   make build     static site in dist/
#   make check-post POST=<thread>/<slug>   build and check one lecture post
#   make verify-post POST=<thread>/<slug> SRC=<file>[,<file>] [PAGES=1-4]
#                  Codex checks the post against its sources
#
# Both servers listen on port 4300. From the laptop see README.md.

export PATH := $(HOME)/.local/node/bin:$(PATH)
ASTRO := ./node_modules/.bin/astro

.DEFAULT_GOAL := help
.PHONY: help start preview stop status logs dev build check-post verify-post

help:
	@sed -n '3,14p' Makefile | sed 's/^# \{0,1\}//'

node_modules/.package-lock.json: package.json package-lock.json
	npm install --no-audit --no-fund
	@touch $@

start: node_modules/.package-lock.json
	@$(ASTRO) preview stop >/dev/null 2>&1 || true
	$(ASTRO) dev --background

preview: build
	@$(ASTRO) dev stop >/dev/null 2>&1 || true
	$(ASTRO) preview --background

stop:
	@$(ASTRO) dev stop 2>/dev/null || true
	@$(ASTRO) preview stop 2>/dev/null || true

status:
	@$(ASTRO) dev status || true
	@$(ASTRO) preview status || true

logs:
	$(ASTRO) dev logs --follow

dev: node_modules/.package-lock.json
	$(ASTRO) dev

build: node_modules/.package-lock.json
	$(ASTRO) build

check-post: node_modules/.package-lock.json
	@test -n "$(POST)" || { echo "usage: make check-post POST=<thread>/<slug>"; exit 2; }
	node skills/lecture-post/scripts/check_post.mjs $(POST)

verify-post:
	@test -n "$(POST)" -a -n "$(SRC)" || { echo "usage: make verify-post POST=<thread>/<slug> SRC=<file>[,<file>] [PAGES=1-4]"; exit 2; }
	node skills/lecture-post/scripts/verify_post.mjs $(POST) --source "$(SRC)" $(if $(PAGES),--pages $(PAGES))
