/**
 * 분양 페이지 URL IndexNow 일괄 제출 (배포 후 실행)
 * node --env-file=.env.local tools/submit-breed-indexnow.mjs
 */
import fs from "fs";
import path from "path";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sesan.agapet.co.kr"
).replace(/\/$/, "");
const KEY =
  process.env.INDEXNOW_KEY?.trim() || "f4e8fb3912a5d6f628c4255cc466f799";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const CHUNK = 40;

function parseQuotedList(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  return [...text.matchAll(/"([^"\\]+)"/g)].map((m) => m[1]);
}

function loadRegions() {
  return parseQuotedList(
    path.join(process.cwd(), "src/data/korea-regions.ts")
  ).filter((s) => s !== "KoreaRegion");
}

function loadDefs() {
  const text = fs.readFileSync(
    path.join(process.cwd(), "src/data/breed-defs.ts"),
    "utf8"
  );
  const defs = [];
  const blocks = text.split(/\{\s*id:/).slice(1);
  for (const block of blocks) {
    const id = block.match(/^\s*"([^"]+)"/)?.[1];
    const category = block.match(/category:\s*"([^"]+)"/)?.[1];
    const intentsBlock = block.match(/intents:\s*\[([\s\S]*?)\]/)?.[1] || "";
    const intents = [...intentsBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    if (id && category && intents.length) {
      defs.push({ id, category, intents });
    }
  }
  return defs;
}

function buildUrls() {
  const regions = loadRegions();
  const defs = loadDefs();
  const urls = [`${SITE_URL}/bunyang`, `${SITE_URL}/goyang`];
  for (const def of defs) {
    const base = def.category === "cat" ? "goyang" : "bunyang";
    for (const intent of def.intents) {
      urls.push(`${SITE_URL}/${base}/${encodeURIComponent(intent)}`);
      for (const region of regions) {
        urls.push(
          `${SITE_URL}/${base}/${encodeURIComponent(`${region}-${intent}`)}`
        );
      }
    }
  }
  return [...new Set(urls)];
}

async function submitChunk(urlList) {
  const host = new URL(SITE_URL).host;
  const payload = {
    host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList,
  };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const text = await res.text().catch(() => "");
  return { status: res.status, text: text.slice(0, 200) };
}

const urls = buildUrls();
console.log(`urls=${urls.length} site=${SITE_URL}`);

let ok = 0;
let fail = 0;
for (let i = 0; i < urls.length; i += CHUNK) {
  const chunk = urls.slice(i, i + CHUNK);
  const batch = Math.floor(i / CHUNK) + 1;
  const totalBatches = Math.ceil(urls.length / CHUNK);
  try {
    const { status, text } = await submitChunk(chunk);
    if (status === 200 || status === 202) {
      ok += chunk.length;
      if (batch % 20 === 0 || batch === totalBatches) {
        console.log(`ok ${batch}/${totalBatches} · submitted ${ok}`);
      }
    } else {
      fail += chunk.length;
      console.error(`fail batch ${batch} HTTP ${status} ${text}`);
    }
  } catch (e) {
    fail += chunk.length;
    console.error(`fail batch ${batch}`, e.message);
  }
  // 과도한 요청 완화
  await new Promise((r) => setTimeout(r, 120));
}

console.log(
  JSON.stringify({ ok, fail, total: urls.length, site: SITE_URL }, null, 2)
);
process.exit(fail ? 1 : 0);
