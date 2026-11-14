#!/usr/bin/env node
// 逐条发布批准检查（团队规则 2026-10-21：发布键在月明）。
// 用法：
//   检查：node scripts/check-approval.mjs --approval <approval.json> --item <作品ID> --platform <平台> --fingerprint <sha256>
//   发布成功后核销：node scripts/check-approval.mjs --approval <approval.json> --consume --link <公开链接>
// approval.json 由执行者在月明看过最终预览、对这一条明确批准后当场写入（见 references/per-item-approval.md）。
// 只认这一条：作品ID、平台、内容指纹都必须一致；已核销（consumed）的批准不能再用。退出码 0=可以发布，2=不可以。
import fs from 'node:fs';

const argv = process.argv.slice(2);
const opt = name => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
const fail = msg => { console.error(JSON.stringify({status: 'NOT_APPROVED', reason: msg})); process.exit(2); };

const file = opt('--approval');
if (!file) fail('缺少 --approval：先给月明看最终预览，拿到对这一条的明确批准');
let a;
try { a = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { fail(`读不到批准记录：${e.message}`); }

if (argv.includes('--consume')) {
  const link = opt('--link');
  if (!link) fail('核销时必须带 --link（发布后的公开链接或平台作品页），用于回报月明');
  if (a.consumed) fail('这条批准已经核销过，不能再用');
  a.consumed = true; a.publishedLink = link; a.consumedAt = new Date().toISOString();
  fs.writeFileSync(file, JSON.stringify(a, null, 2));
  console.log(JSON.stringify({status: 'CONSUMED', item: a.item, platform: a.platform, link}));
  process.exit(0);
}

const need = ['item', 'platform', 'fingerprint', 'approvedBy', 'approvedAt', 'previewShown', 'approvalQuote'];
for (const k of need) if (!a[k]) fail(`批准记录缺字段 ${k}`);
if (a.consumed) fail('这条批准已用过（consumed=true）；以前的批准不能复用，重新给月明看预览');
if (a.item !== opt('--item')) fail(`批准的是作品 ${a.item}，不是 ${opt('--item')}`);
if (a.platform !== opt('--platform')) fail(`批准的是平台 ${a.platform}，不是 ${opt('--platform')}`);
if (a.fingerprint !== opt('--fingerprint')) fail('内容指纹变了：批准后改过文案/媒体/设置，要重新给月明看预览');
const age = Date.now() - Date.parse(a.approvedAt);
if (!(age >= 0 && age < 24 * 3600 * 1000)) fail('批准时间无效或超过 24 小时，重新确认');
console.log(JSON.stringify({status: 'APPROVED', item: a.item, platform: a.platform}));
