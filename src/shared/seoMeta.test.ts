import test from 'node:test';
import assert from 'node:assert/strict';
import { PSEO_PAGES } from './pseoData';
import { BLOG_ARTICLES } from './blogData';
import { getAllPublicPaths, getRouteSEO } from './seoMeta';

test('All pSEO and blog routes have unique titles, descriptions, and paths', () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const paths = new Set<string>();

  for (const page of PSEO_PAGES) {
    assert.equal(paths.has(page.path), false, `Duplicate path: ${page.path}`);
    assert.equal(titles.has(page.seoTitle), false, `Duplicate title: ${page.seoTitle}`);
    assert.equal(descriptions.has(page.metaDescription), false, `Duplicate description: ${page.metaDescription}`);
    paths.add(page.path);
    titles.add(page.seoTitle);
    descriptions.add(page.metaDescription);
  }

  for (const article of BLOG_ARTICLES) {
    assert.equal(paths.has(article.path), false, `Duplicate path: ${article.path}`);
    assert.equal(titles.has(article.seoTitle), false, `Duplicate title: ${article.seoTitle}`);
    assert.equal(descriptions.has(article.metaDescription), false, `Duplicate description: ${article.metaDescription}`);
    paths.add(article.path);
    titles.add(article.seoTitle);
    descriptions.add(article.metaDescription);
  }
});

test('getRouteSEO resolves public pages, private noindex routes, and 404s accurately', () => {
  const home = getRouteSEO('/', 'https://freecvrater.com');
  assert.equal(home.status, 200);
  assert.equal(home.robots, 'index, follow');
  assert.equal(home.jsonLd.length >= 3, true);

  const results = getRouteSEO('/results', 'https://freecvrater.com');
  assert.equal(results.status, 200);
  assert.equal(results.robots, 'noindex, nofollow');

  const swEng = getRouteSEO('/cv-review/software-engineer/', 'https://freecvrater.com');
  assert.equal(swEng.status, 200);
  assert.equal(swEng.canonicalUrl, 'https://freecvrater.com/cv-review/software-engineer');
  assert.ok(swEng.matchedPseo);

  const missing = getRouteSEO('/nonexistent-route', 'https://freecvrater.com');
  assert.equal(missing.status, 404);
  assert.equal(missing.robots, 'noindex, nofollow');

  assert.equal(getAllPublicPaths().length, 6 + PSEO_PAGES.length + BLOG_ARTICLES.length);
});
