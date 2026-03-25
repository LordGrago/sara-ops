# projects

Project tracker — overview of all active and planned work.

## Purpose
Filterable grid of all projects across categories (film, website, content, art, strategy). Click any card to open a detail panel with description, milestones timeline, and team.

## Data
Reads `data/projects.json` only. No writes.

## Views
- **Grid**: project cards with status badge, description excerpt, milestone progress bar, team avatars
- **Detail panel**: slide-in aside with full description, team list, milestones timeline (with overdue highlighting), links

## Filters
- **Category**: All / Film / Website / Content / Art / Strategy
- **Status**: All / Active / Planned / Paused / Done

## Layout
Single-column main area (grid auto-fill, min 300px). Detail panel slides in from the right as a fixed overlay.
