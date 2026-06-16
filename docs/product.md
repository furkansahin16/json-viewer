# JSON Viewer

## Goal

Build a tiny, fast JSON viewer and formatter for `json.furkansahin.dev`.

The app should feel like a polished everyday utility: minimal, quiet, responsive,
and useful without asking the user to think too much.

## Initial Scope

- Paste or type JSON into an editor.
- Format JSON with readable indentation.
- Minify JSON.
- Validate JSON and show clear errors.
- Copy formatted or minified output.
- Clear the editor.
- Toggle light, dark, and system themes.
- Work fully in the browser for JSON operations.
- Serve as a small Go web app.

## Non-Goals For The First Version

- User accounts.
- Server-side JSON storage.
- Sharing links.
- Large collaborative editor features.
- Complex schema validation.
- Deployment automation.
- Docker or CI/CD decisions.

## Design Direction

- Apple-like minimal interface.
- Light and dark theme.
- Calm neutral colors with restrained accent usage.
- Two-pane layout on desktop.
- Single-column layout on mobile.
- Compact toolbar with icon-style actions where practical.
- No landing page; the tool itself is the first screen.

## Technical Direction

- Go `net/http` server.
- Embedded static files.
- Browser-side JSON parsing and formatting.
- No heavy frontend framework for the first version.
- Keep the app easy to deploy as a single binary later.

