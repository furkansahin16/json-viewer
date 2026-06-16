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
curl http://localhost:8080/healthz
```

Expected response:

```json
{"status":"ok"}
```

## Build

```sh
go build -o bin/json-viewer ./cmd/server
```

