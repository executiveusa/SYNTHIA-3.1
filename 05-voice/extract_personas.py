"""Fetch the AKASHPORTFOLIO persona markdown files into alex-kupuri.
synthia-prime.md -> SOUL.md (verbatim, the Synthia brain identity)
ivette-voice.md -> skills/ivette-voice.md
7 agents        -> vault/agents/*.md (sphere nodes)
"""
import os
import urllib.request

BASE = "https://raw.githubusercontent.com/executiveusa/AKASHPORTFOLIO/main/apps/control-room/agents"
DST = r"C:\Users\execu\ZCodeProject\alex-kupuri"

os.makedirs(os.path.join(DST, "skills"), exist_ok=True)
os.makedirs(os.path.join(DST, "vault", "agents"), exist_ok=True)

# 1. SOUL.md = synthia-prime
fetches = [
    ("synthia-prime.md", "SOUL.md"),
    ("ivette-voice.md", "skills/ivette-voice.md"),
    # agent roster -> vault/agents
    ("synthia-prime.md", "vault/agents/synthia-prime.md"),
    ("clandestino.md", "vault/agents/clandestino.md"),
    ("fany.md", "vault/agents/fany.md"),
    ("merlina.md", "vault/agents/merlina.md"),
    ("morpho.md", "vault/agents/morpho.md"),
    ("ralphy.md", "vault/agents/ralphy.md"),
    ("indigo.md", "vault/agents/indigo.md"),
    ("ivette-voice.md", "vault/agents/ivette-voice.md"),
]

for src_name, dst_rel in fetches:
    url = f"{BASE}/{src_name}"
    dst = os.path.join(DST, dst_rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "alex-kupuri-extractor"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        with open(dst, "wb") as f:
            f.write(data)
        print(f"OK   {len(data):>6} bytes  {dst_rel}")
    except Exception as e:
        print(f"FAIL  {src_name} -> {dst_rel}: {e}")
