FROM golang:1.26.4-alpine3.24 AS build

WORKDIR /src

COPY go.mod ./
COPY cmd ./cmd

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/json-viewer ./cmd/server

FROM scratch

ENV PORT=8080

COPY --from=build /out/json-viewer /json-viewer

USER 65532:65532
EXPOSE 8080

ENTRYPOINT ["/json-viewer"]
