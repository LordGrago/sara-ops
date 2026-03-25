#!/bin/bash
# Sara Ops — repo bootstrap
# Run once from the repo root: bash init.sh

set -e

echo "→ Creating directory structure..."

mkdir -p .github/workflows
mkdir -p data
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
mkdir -p skills

echo "→ Creating empty data files..."

# Only create if they don't exist yet
[ -f data/projects.json ]  || echo "[]" > data/projects.json
[ -f data/tasks.json ]     || echo "[]" > data/tasks.json
[ -f data/content.json ]   || echo "[]" > data/content.json
[ -f data/websites.json ]  || echo "[]" > data/websites.json
[ -f data/galleries.json ] || echo "[]" > data/galleries.json

echo "→ Creating module README stubs..."

for module in brand-filter projects task-map content-plan film-projects website-builder gallery-3d art-projects; do
  if [ ! -f "modules/$module/README.md" ]; then
    echo "# $module\n\nSee CLAUDE.md for full module spec." > "modules/$module/README.md"
  fi
done

echo "→ Creating .gitignore..."

cat > .gitignore << 'EOF'
.DS_Store
Thumbs.db
*.log
node_modules/
.env
EOF

echo "→ Creating GitHub Actions deploy workflow..."

cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
EOF

echo ""
echo "✓ Scaffold complete."
echo ""
echo "Next steps:"
echo "  1. git init && git add . && git commit -m 'init: repo scaffold'"
echo "  2. Push to GitHub, enable Pages in repo settings (source: GitHub Actions)"
echo "  3. Open index.html in browser to verify dashboard loads"
echo "  4. Start building modules one by one"
