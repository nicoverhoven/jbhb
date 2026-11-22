import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');

function collectTestFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectTestFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.test.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

function resolvePackageBin(pkgName, binName) {
  const pkgJsonPath = require.resolve(`${pkgName}/package.json`, { paths: [rootDir] });
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  const binRel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.[binName];
  if (!binRel) {
    throw new Error(`Could not locate "${binName}" binary for package "${pkgName}".`);
  }
  return path.resolve(path.dirname(pkgJsonPath), binRel);
}

function ensureBuiltDistForTests() {
  const distIndex = path.join(rootDir, 'dist', 'index.html');
  const publicManifest = path.join(rootDir, 'public', '.vercel-static-manifest.json');
  if (fs.existsSync(distIndex) && fs.existsSync(publicManifest)) {
    return;
  }

  console.log('[test] Built frontend assets missing; running Vite build + Vercel static staging...');
  const stageScript = path.join(rootDir, 'scripts', 'prepare-vercel-public.mjs');
  spawnSync(process.execPath, [stageScript, '--clean'], {
    cwd: rootDir,
    stdio: 'inherit',
  });

  const viteBin = resolvePackageBin('vite', 'vite');
  const viteRes = spawnSync(process.execPath, [viteBin, 'build'], {
    cwd: rootDir,
    stdio: 'inherit',
  });
  if (viteRes.status !== 0) {
    process.exit(viteRes.status ?? 1);
  }

  const stageRes = spawnSync(process.execPath, [stageScript], {
    cwd: rootDir,
    stdio: 'inherit',
  });
  if (stageRes.status !== 0) {
    process.exit(stageRes.status ?? 1);
  }
}

ensureBuiltDistForTests();

const testFiles = collectTestFiles(srcDir)
  .map((file) => path.relative(rootDir, file))
  .sort();

if (testFiles.length === 0) {
  console.error('[test] No *.test.ts files found under src/.');
  process.exit(1);
}

const tsxCliPath = resolvePackageBin('tsx', 'tsx');
const testRun = spawnSync(process.execPath, [tsxCliPath, '--test', ...testFiles], {
  cwd: rootDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'test',
  },
});

if (testRun.error) {
  console.error('[test] Failed to execute tsx test runner:', testRun.error.message);
  process.exit(1);
}

process.exit(testRun.status ?? 1);
