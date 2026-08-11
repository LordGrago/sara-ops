# Data Schemas — Sara Ops

All data lives in `/data/` as JSON files.

## `brand.json`

```json
{
  "essence": "string",
  "tagline": "string",
  "archetype": "string",
  "central_thesis": "string",
  "values": [{ "name": "string", "description": "string" }],
  "utp": [{ "pillar": "string", "description": "string" }],
  "anti_positioning": ["string"],
  "voice": {
    "tone": ["string"],
    "vocabulary_use": ["string"],
    "vocabulary_avoid": ["string"],
    "reframes": [{ "instead": "string", "say": "string" }]
  },
  "content_pillars": [
    { "id": "string", "name": "string", "description": "string", "formats": ["string"] }
  ]
}
```

## `projects.json`

```json
[{
  "id": "string",
  "title": "string",
  "category": "website | film | art | content | strategy",
  "status": "active | paused | planned | done",
  "phase": "string",
  "owner": "string",
  "team": ["string"],
  "description": "string",
  "milestones": [{ "title": "string", "due": "YYYY-MM-DD", "done": false }],
  "links": [{ "label": "string", "url": "string" }],
  "updated": "ISO date"
}]
```

## `tasks.json`

```json
[{
  "id": "string",
  "project_id": "string",
  "title": "string",
  "description": "string",
  "status": "todo | in_progress | review | done | blocked",
  "priority": "high | medium | low",
  "assignee": "string",
  "due": "YYYY-MM-DD | null",
  "tags": ["string"],
  "created": "ISO date",
  "updated": "ISO date"
}]
```

## `content.json`

```json
[{
  "id": "string",
  "title": "string",
  "channel": "telegram | instagram | reels | youtube | website",
  "pillar": "decoding | inner_world | provocation | collection_stories",
  "status": "idea | in_progress | ready | scheduled | published",
  "publish_date": "YYYY-MM-DD | null",
  "assignee": "string",
  "format": "string",
  "notes": "string",
  "tags": ["string"]
}]
```

## `websites.json` (for website-builder module)

```json
[{
  "id": "string",
  "scroll_position": 1,
  "section_name": "string",
  "strategic_function": "string",
  "emotional_job": "string",
  "audience": "entrepreneurs | families | corporate | all",
  "content_type": "hero | about | services | proof | contact | special",
  "status": "idea | sketched | designed | built | live",
  "figma_node": "string | null",
  "notes": "string",
  "variants": [{ "id": "A", "label": "string", "description": "string" }]
}]
```

## `galleries.json` (for gallery-3d module)

Schema TBD when module is built. Will include floor plan data, wall positions, artwork placements, and lighting.
