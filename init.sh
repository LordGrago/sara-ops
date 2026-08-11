#!/bin/bash
# init.sh — Sara Ops project scaffold
# Run once after cloning to create empty data files and module directories.
# Does NOT overwrite existing files.

set -e

echo "→ Scaffolding sara-ops..."

# Directories
mkdir -p .github/workflows
mkdir -p data
mkdir -p docs
mkdir -p shared/components
mkdir -p shared/styles
mkdir -p shared/utils
mkdir -p modules/brand-filter
mkdir -p modules/projects
mkdir -p modules/task-map
mkdir -p modules/content-plan
mkdir -p modules/film-projects
mkdir -p modules/website-builder
mkdir -p modules/gallery-3d
mkdir -p modules/art-projects

# Empty data files (only if not already present)
for name in projects tasks content websites galleries; do
  file="data/${name}.json"
  if [ ! -f "$file" ]; then
    echo "[]" > "$file"
    echo "  created $file"
  else
    echo "  skipped $file (exists)"
  fi
done

# Module stub files
for module in brand-filter projects task-map content-plan film-projects website-builder gallery-3d art-projects; do
  dir="modules/$module"
  for stub in index.html style.css app.js README.md; do
    file="$dir/$stub"
    if [ ! -f "$file" ]; then
      touch "$file"
      echo "  created $file"
    fi
  done
done

echo ""
echo "✓ Done. Next steps:"
echo "  1. npm install          (installs Vite)"
echo "  2. npm run dev          (start dev server)"
echo "  3. Push to GitHub and enable Pages (Settings → Pages → GitHub Actions)"
echo "  4. Build modules one by one — start with brand-filter"
