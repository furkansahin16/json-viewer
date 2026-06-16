# JSON Viewer

A tiny JSON viewer and formatter for `json.furkansahin.dev`.

## Requirements

- Go 1.22+

## Run Locally

```sh
go run ./cmd/server
```

The app starts on `http://localhost:8080`.

Use a custom port with:

```sh
PORT=3000 go run ./cmd/server
```

## Health Check

```sh
curl http://localhost:8080/health
```

Expected response:

```json
{"status":"ok"}
```

## Build

```sh
go build -o bin/json-viewer ./cmd/server
```

## Environment

```sh
cp .env.example .env
```

The app reads:

```txt
PORT=8080
```

## Docker

Build the image:

```sh
docker build -t json-viewer .
```

Run it:

```sh
docker run --rm --env-file .env -p 8080:8080 json-viewer
```

Use a different host port if needed:

```sh
docker run --rm -e PORT=8080 -p 5500:8080 json-viewer
```
