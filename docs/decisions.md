# Decisions

## 001: Start Without Deployment Automation

Status: accepted

We will first build the local app and postpone deployment decisions.

Reasoning:

- The app scope is small.
- The server has limited memory.
- It is easier to choose between Docker and a systemd binary after the app shape is clear.

## 002: Use Browser-Side JSON Processing

Status: accepted

JSON formatting, minifying, validation, and copying will happen in the browser.

Reasoning:

- It avoids sending pasted JSON to the server.
- It keeps the Go server tiny.
- It makes the app faster for normal usage.

## 003: Use Plain Frontend For Version 1

Status: accepted

The first version will use plain HTML, CSS, and JavaScript.

Reasoning:

- The app does not need a frontend framework yet.
- Plain assets keep memory and build complexity low.
- The project can still be upgraded later if the UI grows.

