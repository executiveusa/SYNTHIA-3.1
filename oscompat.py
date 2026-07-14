"""oscompat — cross-platform OS abstraction for ALEX.

Replaces brain-jetty's macOS-only shell calls (osascript / mdfind / pbcopy /
networksetup / launchctl) with OS-aware equivalents. On unsupported platforms,
desktop-control features degrade gracefully to spoken Spanish messages instead
of crashing.

Design:
- The voice/brain/galaxy loop needs NONE of these functions — it's pure HTTP + browser.
- These functions only power the optional "voice-driven desktop control" bonus features
  (dark mode, app launching, file search, clipboard, screen overlay).
- `desktop_control_available()` is the gatekeeper: server.py checks it before attempting
  any desktop control, and returns a graceful "no disponible" message otherwise.

See PLATFORM_AUDIT.md for the full inventory of calls this replaces.
"""
import platform as _platform
import shutil
import subprocess
import glob as _glob

# Module is safe to import on every OS (no side effects at import time).

__all__ = [
    "current_os", "is_macos", "is_windows", "is_linux",
    "open_path", "run_app", "quit_app", "set_clipboard", "find_files",
    "desktop_control_available",
]


# ─── OS detection ─────────────────────────────────────────────────────────────

def current_os():
    """Return 'Windows', 'Darwin' (macOS), or 'Linux'."""
    return _platform.system()


def is_macos():
    return current_os() == "Darwin"


def is_windows():
    return current_os() == "Windows"


def is_linux():
    return current_os() == "Linux"


def desktop_control_available():
    """True only on platforms where voice-driven desktop control is implemented.

    macOS = full (osascript). Windows/Linux = not yet wired (the bonus features
    are macOS-only for the MVP; the voice/brain/galaxy core runs everywhere).
    """
    return is_macos()


# ─── Desktop control primitives (graceful no-ops off-mac) ─────────────────────

def open_path(path):
    """Open a file/folder/URL in the OS default app. Returns True on success, False otherwise.

    Returns False fast for falsy/None input (never spawns a shell on nothing).
    """
    if not path:
        return False
    try:
        if is_macos():
            subprocess.run(["open", str(path)], check=False)
        elif is_windows():
            # `start` needs cmd /c and the empty title arg; shell=True so cmd resolves `start`
            subprocess.run(f'start "" "{path}"', shell=True, check=False)
        elif is_linux():
            subprocess.run(["xdg-open", str(path)], check=False)
        else:
            return False
        return True
    except Exception:
        return False


def run_app(name):
    """Launch an application by name. Returns True if attempted, False if unsupported."""
    try:
        if is_macos():
            subprocess.run(["open", "-a", name], check=False)
            return True
        elif is_windows():
            subprocess.run(f'start "" "{name}"', shell=True, check=False)
            return True
        elif is_linux():
            exe = shutil.which(name)
            if exe:
                subprocess.Popen([exe])
                return True
            return False
        return False
    except Exception:
        return False


def quit_app(name):
    """Quit a running application by name. Returns True if attempted, False if unsupported."""
    try:
        if is_macos():
            subprocess.run(["osascript", "-e", f'tell application "{name}" to quit'], check=False)
            return True
        elif is_windows():
            subprocess.run(["taskkill", "/IM", name, "/F"], check=False)
            return True
        elif is_linux():
            subprocess.run(["pkill", "-f", name], check=False)
            return True
        return False
    except Exception:
        return False


def set_clipboard(text):
    """Set the system clipboard. Returns True on success, False if unsupported."""
    try:
        text = str(text)
        if is_macos():
            subprocess.run(["pbcopy"], input=text, text=True, check=False)
            return True
        elif is_windows():
            # `clip` reads stdin — works for plain text
            subprocess.run(["clip"], input=text, text=True, check=False)
            return True
        elif is_linux():
            # prefer xclip, fall back to xsel
            if shutil.which("xclip"):
                subprocess.run(["xclip", "-selection", "clipboard"], input=text, text=True, check=False)
                return True
            if shutil.which("xsel"):
                subprocess.run(["xsel", "--clipboard", "--input"], input=text, text=True, check=False)
                return True
            return False
        return False
    except Exception:
        return False


def find_files(pattern, root="."):
    """Find files matching a glob pattern under root. Cross-platform via Python glob."""
    try:
        search = str(root).rstrip("/\\") + "/**/" + str(pattern).lstrip("/")
        return _glob.glob(search, recursive=True)
    except Exception:
        return []


# Convenience for server.py: a Spanish message returned when a desktop-control
# feature is requested on an unsupported platform. Keeps persona voice intact.
def unsupported_message(feature):
    """Return a graceful es-MX 'not available' message for a desktop-control feature."""
    return (f"Esa función —{feature}— es control del escritorio y por ahora solo "
            f"funciona en Mac. En {current_os()} no puedo hacerlo todavía, pero todo "
            f"lo demás del cerebro funciona perfecto.")
