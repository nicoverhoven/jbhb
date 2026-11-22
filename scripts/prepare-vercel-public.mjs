import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');
const manifestPath = path.join(publicDir, '.vercel-static-manifest.json');

const args = new Set(process.argv.slice(2));
const cleanOnly = args.has('--clean');
const cleanAll = args.has('--clean-all');

function cleanStagedPublicAssets() {
  if (fs.existsSync(manifestPath)) {
    try {
      const previousFiles = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      if (Array.isArray(previousFiles)) {
        for (const rel of previousFiles) {
          const target = path.join(publicDir, ...String(rel).split(/[/\\]/));
          if (fs.existsSync(target) && fs.statSync(target).isFile()) {
            fs.unlinkSync(target);
          }
        }
      }
    } catch {
      // Ignore malformed manifest and proceed
    }
    fs.unlinkSync(manifestPath);
  }

  // Also ensure any hashed Vite JS/CSS chunks or forbidden static SEO files are removed from public/
  const publicAssetsDir = path.join(publicDir, 'assets');
  if (fs.existsSync(publicAssetsDir)) {
    for (const entry of fs.readdirSync(publicAssetsDir)) {
      if (/\.(js|css)$/i.test(entry)) {
        fs.unlinkSync(path.join(publicAssetsDir, entry));
      }
    }
  }
  for (const forbidden of ['index.html', 'robots.txt', 'sitemap.xml']) {
    const forbiddenPath = path.join(publicDir, forbidden);
    if (fs.existsSync(forbiddenPath)) {
      fs.unlinkSync(forbiddenPath);
    }
  }
}

cleanStagedPublicAssets();

if (cleanAll) {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.rmSync(path.resolve(rootDir, 'server.js'), { force: true });
  process.exit(0);
}

if (cleanOnly) {
  process.exit(0);
}

if (!fs.existsSync(distDir)) {
  console.error('[prepare-vercel-public] dist/ directory not found. Run "vite build" first.');
  process.exit(1);
}

const stagedFiles = [];

function syncStaticFiles(srcDir, relBase = '') {
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const relPath = relBase ? path.join(relBase, entry.name) : entry.name;

    if (entry.isDirectory()) {
      syncStaticFiles(srcPath, relPath);
      continue;
    }

    // Keep index.html exclusively in dist/index.html so Express handles SSR SEO injection for '/'
    // and never put static robots.txt/sitemap.xml in public/ so dynamic Express endpoints run.
    if (relPath === 'index.html' || relPath === 'robots.txt' || relPath === 'sitemap.xml') {
      continue;
    }

    const destPath = path.join(publicDir, relPath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    // Skip rewriting already-present identical static files (e.g., git-tracked public/assets/aistudio/*)
    if (fs.existsSync(destPath)) {
      const srcBuf = fs.readFileSync(srcPath);
      const destBuf = fs.readFileSync(destPath);
      if (srcBuf.equals(destBuf)) {
        continue;
      }
    }

    fs.copyFileSync(srcPath, destPath);
    stagedFiles.push(relPath.split(path.sep).join('/'));
  }
}

syncStaticFiles(distDir);
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(manifestPath, JSON.stringify(stagedFiles, null, 2) + '\n', 'utf-8');

console.log(`[prepare-vercel-public] Staged ${stagedFiles.length} built static asset(s) into public/ for Vercel CDN.`);
