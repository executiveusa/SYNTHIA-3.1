# Alex Vault — Synthia's Knowledge Brain

This folder is the markdown knowledge base that feeds the 3D galaxy (`build.py` reads it, `viewer/graph-data.js` renders it). Each `.md` file becomes a sphere node; links between them become constellations.

## Structure

```
vault/
├── README.md                 (this file — a node itself)
└── agents/                   (the Kupuri Media agent roster, extracted from AKASHPORTFOLIO)
    ├── synthia-prime.md      Synthia 3.0 — CEO Digital (the SOUL)
    ├── ivette-voice.md       Brand Guardian — preserves Ivette's authentic voice
    ├── clandestino.md
    ├── fany.md
    ├── merlina.md
    ├── morpho.md
    ├── ralphy.md
    └── indigo.md
```

## Adding to the brain

To grow the galaxy, drop more `.md` files here (or in subfolders). Then re-run:

```bash
python build.py --vault ./vault --out ./viewer
```

Each note should start with a YAML front-matter block (`name`, `description`) and a short summary paragraph — that's what becomes the sphere's preview text.

## ChatGPT exports

When Ivette uploads her ChatGPT export ZIP (Sub-project 1 feature 1.5a), it unpacks into `vault/chatgpt/` (gitignored) — her real conversation history becomes part of the brain.
