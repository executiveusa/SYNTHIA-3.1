import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const productUrl = "https://akashportfolio-control-room.vercel.app/landing";

test("the marketing homepage has no onboarding or app-route coupling", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.doesNotMatch(html, /has_seen_onboarding|kupuri_onboarding_seen/);
  assert.doesNotMatch(html, /window\.location|location\.href\s*=\s*["']\/onboarding/);
  assert.doesNotMatch(html, /href=["']\/(?:auth|cockpit|dashboard|onboarding)(?:\/|["'?])/);
  assert.doesNotMatch(html, /directorio-kupuri\.vercel\.app/);
  assert.doesNotMatch(html, /\/images\/hero\//);
  assert.match(html, new RegExp(productUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("the contact experience does not claim a message was sent without a backend", async () => {
  const script = await readFile(new URL("../js/contact.js", import.meta.url), "utf8");

  assert.doesNotMatch(script, /Simulate form submission|message has been sent/i);
  assert.match(script, /mailto:referencias@kupurimedia\.com/);
});

test("marketing animations only use the five Kupuri project images", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const heroScript = await readFile(new URL("../js/hero.js", import.meta.url), "utf8");
  const contactScript = await readFile(new URL("../js/contact.js", import.meta.url), "utf8");
  const footerScript = await readFile(new URL("../js/footer.js", import.meta.url), "utf8");
  const projectImages = await readFile(new URL("../js/project-images.js", import.meta.url), "utf8");

  assert.match(html, /\/images\/work-items\/work-item-1\.jpg/);
  assert.match(heroScript, /projectImages\[currentImageIndex - 1\]/);
  assert.match(contactScript, /const images = projectImages/);
  assert.match(footerScript, /const imagePaths = projectImages/);
  assert.match(projectImages, /work-item-5-soltar\.png/);
  assert.doesNotMatch(projectImages, /work-item-5\.jpg/);
  assert.doesNotMatch(heroScript, /\/images\/hero\/img/);
});

test("the fifth project is named SOLTAR everywhere in site copy", async () => {
  const files = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../js/i18n.js", import.meta.url), "utf8"),
  ]);
  const siteCopy = files.join("\n");
  const retiredName = new RegExp(["sue", "lta"].join(""), "i");

  assert.doesNotMatch(siteCopy, retiredName);
  assert.equal((siteCopy.match(/SOLTAR/g) || []).length, 4);
});

test("the production build includes both public HTML pages", async () => {
  const { default: config } = await import("../vite.config.js");
  const inputs = Object.values(config.build.rollupOptions.input);

  assert.equal(inputs.length, 2);
  assert.ok(inputs.some((file) => file.endsWith("index.html")));
  assert.ok(inputs.some((file) => file.endsWith("contact.html")));
});
