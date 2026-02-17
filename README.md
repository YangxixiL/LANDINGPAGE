# ReciTAC LandingPage

Root workspace for the ReciTAC landing page and local Docker file server.

## Structure

- `src/app`: Next.js application
- `docker`: Docker Compose and Nginx config for serving static files

## Run the Next.js app

```bash
cd src/app
npm install
npm run dev
```

## Run the Docker file server

The file server serves files from `OUTPUT_DIR` to `http://localhost:8081`.

1. Copy env template:

```bash
cp .env.example .env
```

2. Start nginx profile:

```bash
cd docker
docker compose --profile local-test-nginx up
```

## Notes

- Root-level `.gitignore` and editor settings are included for consistent project defaults.
