// בדיקת קצה-לקצה לפאנל הניהול. להריץ רק מול שרת מקומי עם DATA_DIR זמני!
//   ADMIN_PASSWORD=pw DATA_DIR=./.e2e-data PORT=4871 node .next/standalone/server.js
//   node scripts/e2e-admin.mjs http://localhost:4871 pw
import fs from "node:fs";
import sharp from "sharp";

const BASE = process.argv[2] ?? "http://localhost:4871";
const PASSWORD = process.argv[3] ?? "pw";

if (!/localhost|127\.0\.0\.1/.test(BASE)) {
  console.error("Refusing to run against a non-local server (the test overwrites site content).");
  process.exit(2);
}

let cookie = "";
let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  if (cond) pass++;
  else fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : "  " + extra}`);
};

async function call(path, init = {}) {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { ...(init.headers ?? {}), cookie },
    redirect: "manual",
  });
  const set = res.headers.get("set-cookie");
  if (set) cookie = set.split(";")[0].endsWith("=") ? "" : set.split(";")[0];
  return res;
}
const json = (body) => ({
  method: "PUT",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});
const home = async () => (await call("/")).text();
const adminHtml = async () => (await call("/admin")).text();

async function upload(name, bytes, type) {
  const form = new FormData();
  form.append("files", new File([bytes], name, { type }));
  const res = await call("/api/admin/logos", { method: "POST", body: form });
  return { status: res.status, data: await res.json() };
}

// ---------- 1. אבטחה ----------
check("PUT content without login -> 401", (await call("/api/admin/content", json({}))).status === 401);
check("POST logos without login -> 401", (await call("/api/admin/logos", { method: "POST" })).status === 401);
check("DELETE logos without login -> 401", (await call("/api/admin/logos?id=x", { method: "DELETE" })).status === 401);
check("empty password -> 400", (await call("/api/admin/login", json({ password: "" }) && { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: "" }) })).status === 400);
const loginRes = await call("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: PASSWORD }) });
check("login with correct password -> 200", loginRes.status === 200);
check("admin page shows editor after login", (await adminHtml()).includes("שמירת טקסטים"));

// ---------- 2. כל טקסט מתחלף מיד ----------
const initial = await adminHtml();
const keys = [...new Set([...initial.matchAll(/\\"key\\":\\"([a-z0-9.]+)\\"/g)].map((m) => m[1]))];
check(`found all editable fields (${keys.length})`, keys.length >= 60, `found ${keys.length}`);

const numeric = /^stats\.\d\.value$/;
const suffix = /^stats\.\d\.suffix$/;
const newTexts = {};
keys.forEach((k, i) => {
  if (numeric.test(k)) newTexts[k] = String(1000 + i);
  else if (suffix.test(k)) newTexts[k] = "x" + i;
  else if (k === "contact.whatsapp") newTexts[k] = "9725099988" + String(i % 10);
  else if (k === "contact.email") newTexts[k] = `qa${i}@example.com`;
  else if (k === "contact.phone") newTexts[k] = "+972 54-777-" + String(1000 + i);
  else newTexts[k] = `QA_${k.replace(/\./g, "_")}_${i}`;
});

let res = await call("/api/admin/content", json(newTexts));
check("save all texts -> 200", res.status === 200, await res.text());

const html = await home();
const missing = keys.filter((k) => {
  if (numeric.test(k) || suffix.test(k)) return false; // מונה מונפש: מוצג רק אחרי גלילה, נבדק דרך /admin
  const v = newTexts[k];
  if (k === "contact.whatsapp") return !html.includes(`wa.me/${v}`);
  return !html.includes(v);
});
check("every text appears on the public homepage immediately", missing.length === 0, "missing: " + missing.join(", "));

const adminAfter = await adminHtml();
const notSaved = keys.filter((k) => !adminAfter.includes(newTexts[k]));
check("every value (incl. stats numbers) is persisted and reloaded", notSaved.length === 0, notSaved.join(", "));

// ---------- 3. ולידציה ----------
const rejects = async (name, patch, expectKey) => {
  const r = await call("/api/admin/content", json({ ...newTexts, ...patch }));
  const body = await r.json();
  check(`validation: ${name}`, r.status === 422 && body.fields?.[expectKey], JSON.stringify(body).slice(0, 120));
};
await rejects("empty required text", { "hero.cta": "   " }, "hero.cta");
await rejects("stats value not a number", { "stats.1.value": "12a" }, "stats.1.value");
await rejects("stats value empty", { "stats.2.value": "" }, "stats.2.value");
await rejects("whatsapp with plus/dashes", { "contact.whatsapp": "+972-50-200" }, "contact.whatsapp");
await rejects("whatsapp too short", { "contact.whatsapp": "123" }, "contact.whatsapp");
await rejects("bad email", { "contact.email": "not-an-email" }, "contact.email");
await rejects("bad phone", { "contact.phone": "call me" }, "contact.phone");
await rejects("single-line too long", { "hero.cta": "x".repeat(151) }, "hero.cta");
await rejects("multiline too long", { "hero.text": "x".repeat(1501) }, "hero.text");
const partial = { ...newTexts };
delete partial["hero.cta"];
const rp = await call("/api/admin/content", json(partial));
check("validation: missing field rejected", rp.status === 422);
const rb = await call("/api/admin/content", { method: "PUT", headers: { "content-type": "application/json" }, body: "not json" });
check("validation: garbage body -> 400", rb.status === 400);
const stillThere = await home();
check("rejected saves did not change the site", stillThere.includes(newTexts["hero.cta"]));

// ---------- 4. לוגואים ----------
const png = fs.readFileSync("public/logo/be-orot-logo.png");
const countLogos = async () => (await call("/api/admin/logos")).json().then((d) => d.logos.length);
const before = await countLogos();

let up = await upload("new-client.png", png, "image/png");
check("upload valid PNG -> added 1", up.status === 200 && up.data.added === 1, JSON.stringify(up.data).slice(0, 100));
const newLogo = up.data.logos[0];
check("new logo is first in list", newLogo?.upload === true);
const h2 = await home();
check("new logo appears on homepage immediately", h2.includes(newLogo.src));
const served = await call(newLogo.src);
check("uploaded file is served (200, image/png)", served.status === 200 && served.headers.get("content-type") === "image/png");

up = await upload("fake.png", Buffer.from("this is not an image"), "image/png");
check("fake PNG (text inside) rejected", up.data.added === 0 && up.data.rejected?.length === 1);
up = await upload("virus.exe", Buffer.from("MZ"), "application/octet-stream");
check("exe rejected", up.data.added === 0 && up.data.rejected?.length === 1);
up = await upload("evil.svg", Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'), "image/svg+xml");
check("SVG with script rejected", up.data.added === 0 && up.data.rejected?.length === 1);
up = await upload("onload.svg", Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="x()"></svg>'), "image/svg+xml");
check("SVG with onload handler rejected", up.data.added === 0);
up = await upload("big.png", Buffer.concat([png, Buffer.alloc(6 * 1024 * 1024)]), "image/png");
check("file over 5MB rejected", up.data.added === 0 && /גדול מדי/.test(up.data.rejected?.[0]?.reason ?? ""));
up = await upload("phone.heic", Buffer.from("x"), "");
check("HEIC rejected with clear reason", up.data.added === 0 && /HEIC/.test(up.data.rejected?.[0]?.reason ?? ""));
up = await upload("empty.png", Buffer.alloc(0), "image/png");
check("empty file rejected", up.data.added === 0);
up = await upload("clean.svg", Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>'), "image/svg+xml");
check("clean SVG accepted", up.data.added === 1);
const realJpg = await sharp({ create: { width: 300, height: 200, channels: 3, background: "#336699" } }).jpeg().toBuffer();
up = await upload("no-type.jpg", realJpg, "");
check("JPG with empty browser type (phones) accepted by extension", up.data.added === 1);
up = await upload("broken.jpg", Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0]), "image/jpeg");
check("JPG with valid header but undecodable body rejected", up.data.added === 0);

// נרמול גודל ומרכוז
const dims = async (src) => {
  const buf = Buffer.from(await (await call(src)).arrayBuffer());
  const meta = await sharp(buf).metadata();
  const box = await sharp(buf).trim().toBuffer({ resolveWithObject: true });
  const trimOffsetLeft = -(box.info.trimOffsetLeft ?? 0);
  const trimOffsetTop = -(box.info.trimOffsetTop ?? 0);
  return { w: meta.width, h: meta.height, bw: box.info.width, bh: box.info.height, cx: trimOffsetLeft + box.info.width / 2, cy: trimOffsetTop + box.info.height / 2 };
};
// 800x800 שקוף עם מלבן אדום קטן 100x50 באמצע-שמאל, שוליים ענקיים
const margins = await sharp({ create: { width: 800, height: 800, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: await sharp({ create: { width: 100, height: 50, channels: 3, background: "#cc0000" } }).png().toBuffer(), left: 50, top: 600 }])
  .png().toBuffer();
up = await upload("tiny-in-margins.png", margins, "image/png");
let d = await dims(up.data.logos[0].src);
check("output is always the 480x288 canvas", d.w === 480 && d.h === 288, JSON.stringify(d));
check("empty margins trimmed and logo scaled up to fill the box (wide logo -> ~400px)", d.bw >= 396 && d.bw <= 400, JSON.stringify(d));
check("logo is centered horizontally and vertically", Math.abs(d.cx - 240) <= 2 && Math.abs(d.cy - 144) <= 2, JSON.stringify(d));
// לוגו גבוה וצר
const tall = await sharp({ create: { width: 100, height: 600, channels: 3, background: "#006600" } }).png().toBuffer();
up = await upload("tall.png", tall, "image/png");
d = await dims(up.data.logos[0].src);
check("tall logo limited by height (<=220) and centered", d.bh <= 220 && d.bh >= 216 && Math.abs(d.cx - 240) <= 2 && Math.abs(d.cy - 144) <= 2, JSON.stringify(d));
// לוגו JPG עם רקע לבן וצורה באמצע
const whiteBg = await sharp({ create: { width: 900, height: 600, channels: 3, background: "#ffffff" } })
  .composite([{ input: await sharp({ create: { width: 200, height: 200, channels: 3, background: "#000000" } }).png().toBuffer(), left: 100, top: 50 }])
  .jpeg().toBuffer();
up = await upload("white-bg.jpg", whiteBg, "image/jpeg");
d = await dims(up.data.logos[0].src);
check("JPG with white margins is trimmed and centered", Math.abs(d.cx - 240) <= 3 && Math.abs(d.cy - 144) <= 3, JSON.stringify(d));
up = await upload("rotated-svg.svg", Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><rect width="40" height="20" fill="red"/></svg>'), "image/svg+xml");
d = await dims(up.data.logos[0].src);
check("SVG rasterized sharply to the same canvas", d.w === 480 && d.bw >= 396, JSON.stringify(d));
check("traversal blocked", (await call("/uploads/..%2f..%2fpackage.json")).status === 404);

const afterAdds = await countLogos();
check("rejected files were not added", afterAdds === before + 7, `${before} -> ${afterAdds}`);

// מחיקה
let del = await call(`/api/admin/logos?id=${encodeURIComponent(newLogo.id)}`, { method: "DELETE" });
check("delete uploaded logo -> 200", del.status === 200);
check("deleted logo disappears from homepage immediately", !(await home()).includes(newLogo.src));
check("deleted logo file is gone (404)", (await call(newLogo.src)).status === 404);

const list = (await (await call("/api/admin/logos")).json()).logos;
const staticLogo = list.find((l) => !l.upload);
if (staticLogo) {
  del = await call(`/api/admin/logos?id=${encodeURIComponent(staticLogo.id)}`, { method: "DELETE" });
  check("delete built-in logo -> 200", del.status === 200);
  const encoded = encodeURIComponent(decodeURIComponent(staticLogo.src));
  check("built-in logo disappears from homepage", !(await home()).includes(encoded));
}
del = await call("/api/admin/logos?id=nope", { method: "DELETE" });
check("delete missing logo -> 404 with message", del.status === 404 && (await del.json()).error);

// ---------- 5. יציאה והגבלת ניסיונות ----------
await call("/api/admin/logout", { method: "POST" });
cookie = "";
check("after logout PUT -> 401", (await call("/api/admin/content", json(newTexts))).status === 401);
let last = 0;
for (let i = 0; i < 6; i++) {
  last = (await call("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: "wrong" + i }) })).status;
}
check("6 wrong passwords -> blocked (429)", last === 429, String(last));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
