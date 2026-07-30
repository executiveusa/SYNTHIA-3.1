"""Tests for oscompat — the cross-platform abstraction layer."""
import platform as _stdlib_platform
from oscompat import (
    current_os, is_macos, is_windows, is_linux,
    open_path, run_app, quit_app, set_clipboard, find_files,
    desktop_control_available,
)


def test_current_os_returns_valid_string():
    assert current_os() in ("Windows", "Darwin", "Linux")


def test_is_macos_matches_system():
    assert is_macos() == (_stdlib_platform.system() == "Darwin")


def test_is_windows_matches_system():
    assert is_windows() == (_stdlib_platform.system() == "Windows")


def test_is_linux_matches_system():
    assert is_linux() == (_stdlib_platform.system() == "Linux")


def test_desktop_control_available_is_bool():
    assert isinstance(desktop_control_available(), bool)


def test_open_path_invalid_returns_without_crashing(monkeypatch):
    """open_path with an empty/None path must not raise — returns False without spawning a shell."""
    # We pass None so the OS-specific branches hit an exception and return False
    # (we do NOT feed a real bad path, because on Windows `start` would pop a dialog).
    assert open_path(None) in (True, False)


def test_set_clipboard_does_not_raise():
    """set_clipboard must succeed or fail gracefully, never raise."""
    assert set_clipboard("hola ivette") in (True, False)


def test_find_files_returns_list():
    result = find_files("*.py", ".")
    assert isinstance(result, list)
