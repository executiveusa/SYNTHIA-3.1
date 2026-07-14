"""Tests for the alex persona SKIN."""
import persona


def test_alex_skin_exists():
    assert "alex" in persona.SKINS


def test_alex_skin_is_warm_es_mx():
    """The alex core prompt must reference Kupuri/Ivette and CDMX/español."""
    core = persona.SKINS["alex"]["core"]
    assert "Kupuri" in core or "Ivette" in core
    assert "español" in core.lower() or "CDMX" in core or "mexicano" in core.lower()


def test_alex_skin_label():
    assert persona.SKINS["alex"]["label"] == "ALEX"


def test_set_skin_to_alex():
    label, voice = persona.set_skin("alex")
    assert label == "ALEX"


def test_alex_is_default_when_no_state():
    """With no saved state, the default skin should be alex."""
    # Temporarily move state aside
    import os, json
    state_path = persona._STATE
    backup = None
    if os.path.exists(state_path):
        backup = open(state_path).read()
        os.remove(state_path)
    try:
        s = persona.state()
        assert s["skin"] == "alex"
    finally:
        if backup is not None:
            with open(state_path, "w") as f:
                f.write(backup)
