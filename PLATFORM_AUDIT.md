# Platform Audit — macOS-specific calls in the brain-jetty engine

**Date:** 2026-07-13
**Goal:** Inventory every macOS-only shell/AppleScript call so `oscompat.py` (Task 3) can abstract them all. Engine = brain-jetty (the refreshed brain-jarvis V4).

## Summary

The engine has a **clean separation**: the voice/brain/galaxy path is cross-platform (Python stdlib + browser Web Speech + HTTP), and all macOS-specific behavior is **isolated in `osctl.py` + a few spots in `server.py`**. This is a contained port, not a rewrite.

- **`osctl.py`** (15KB) — the **entire module** is macOS desktop control. Every function shells out to `osascript` (AppleScript), `mdfind` (Spotlight), `pbcopy` (clipboard), `networksetup`, `pmset`. This is the "voice-driven Mac control" bonus feature set.
- **`server.py`** (112KB) — mostly cross-platform. Only **2 macOS-specific spots**:
  1. `spawn_overlay()` (lines 1141–1168) — uses `launchctl` to draw a desktop ring via `overlay.py` (PyObjC). macOS-only.
  2. `import osctl` (line 360) — pulls in the whole desktop-control module.

## Inventory by file

### `osctl.py` — ALL macOS (14 distinct call sites)

| Line | Call | What it does | Cross-platform replacement |
|---|---|---|---|
| 3 (docstring) | documents osascript/networksetup/pmset/open/mdfind | — | — |
| 32 | `_osa()` → `osascript -e <script>` | the core helper that runs every AppleScript | **Guard the whole module behind `is_macos()`**; on other OS, every function returns a graceful "no disponible" message |
| 67 | `osascript` → Finder desktop bounds | get screen size for overlay positioning | `overlay.py` itself is macOS-only; on other OS, overlay no-ops |
| 94, 98 | `osascript` → System Events dark mode | toggle dark mode | Windows: registry `HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize`; stub if unsupported |
| 113 | `osascript` → System Events key code | simulate keystrokes | Windows: `pywin32` SendInput — but **treat as optional**, no-op if lib missing |
| 121 | Night Shift user shortcut | — | stub (no Windows equiv in scope) |
| 182, 188, 195, 202, 218, 220 | `osascript` → app quit/activate/list/frontmost | app management | Windows: `taskkill`/`start`; Linux: `xdg-open`/`kill`. Implement `run_app()`/`quit_app()` in oscompat |
| 270 | `mdfind` (Spotlight search) | find files | Windows: `where`/`dir /s`; Linux: `find`/`locate`. Implement `find_files()` in oscompat |
| 289, 291, 293, 303 | `pbcopy` + System Events Cmd+V | clipboard paste | Windows: `clip`; or skip paste, just clipboard set. Implement `set_clipboard()` in oscompat |

### `server.py` — 2 macOS-specific spots (rest is cross-platform)

| Line | Call | What it does | Cross-platform replacement |
|---|---|---|---|
| 360 | `import osctl` | pulls desktop-control module | **Lazy-import inside `is_macos()` guard** — `osctl` only imports on macOS. On Windows/Linux, desktop-control routes return "no disponible" without importing osctl at all. |
| 1141–1168 | `spawn_overlay()` — `launchctl` + `overlay.py` (PyObjC) | draws a desktop ring (the "guide me" visual) | **Guard behind `desktop_control_available()`** = `is_macos()`. On Windows/Linux, the `/guide` and `/overlay` endpoints return a spoken "esa función es solo de Mac por ahora" instead of crashing. |

## Cross-platform-safe (no changes needed)

These were audited and are already OS-agnostic:
- `server.py` HTTP server (stdlib `http.server`) — binds `127.0.0.1:4719` everywhere
- LLM calls (`urllib.request` to OpenAI-compatible endpoint) — pure HTTP
- ElevenLabs TTS (`urllib.request` POST) — pure HTTP
- `persona.py` — pure Python (SKINS dict, dials, JSON state)
- `build.py` — reads markdown, writes `graph-data.js` (stdlib only)
- `viewer/` — static HTML/JS, runs in the browser
- `hue.py` — Philips Hue API (HTTP); only called if configured
- `setup_duplex.py` — install helper, platform-agnostic logic

## The port strategy (locked)

1. **`oscompat.py`** exposes: `current_os()`, `is_macos()`, `is_windows()`, `is_linux()`, `open_path()`, `run_app()`, `quit_app()`, `set_clipboard()`, `find_files()`, `desktop_control_available()`.
2. **`server.py` line 360**: change `import osctl` → lazy import inside `if is_macos():`. Desktop-control intents check `desktop_control_available()` first and return a graceful Spanish message otherwise.
3. **`server.py` `spawn_overlay()`**: wrap body in `if desktop_control_available():` → else no-op (the `/guide` + `/overlay` endpoints stay registered but return a spoken "función de Mac").
4. **`osctl.py`**: leave the macOS code intact (it works on Mac), but ensure it's **never imported on non-macOS**. The module becomes macOS-only-by-design; oscompat is the gatekeeper.

**Net result:** On Windows/Linux, the voice/brain/galaxy loop runs fully. Only the desktop-control bonus features (dark mode, app launching, file search, clipboard, screen overlay) are unavailable — and they degrade to spoken Spanish messages instead of crashing.
