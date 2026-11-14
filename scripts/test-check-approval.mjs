#!/usr/bin/env node
// check-approval.mjs 的最小测试：对的那一条能过；别的作品/平台/改过内容/已核销都拒绝。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const here = path.dirname(new URL(import.meta.url).pathname);
const checker = path.join(here, 'check-approval.mjs');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'approval-test-'));
const run = (...args) => spawnSync(process.execPath, [checker, ...args], {encoding: 'utf8'}).status;
try {
  const f = path.join(dir, 'approval.json');
  fs.writeFileSync(f, JSON.stringify({item: 'W1', platform: 'x', fingerprint: 'abc', approvedBy: '月明',
    approvedAt: new Date().toISOString(), previewShown: 'p.png', approvalQuote: '批准发布 W1 到 X', consumed: false}));
  const ok = ['--approval', f, '--item', 'W1', '--platform', 'x', '--fingerprint', 'abc'];
  const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
  expect(run(...ok) === 0, '正确的批准应通过');
  expect(run('--approval', f, '--item', 'W2', '--platform', 'x', '--fingerprint', 'abc') === 2, '别的作品应拒绝');
  expect(run('--approval', f, '--item', 'W1', '--platform', 'douyin', '--fingerprint', 'abc') === 2, '别的平台应拒绝');
  expect(run('--approval', f, '--item', 'W1', '--platform', 'x', '--fingerprint', 'zzz') === 2, '内容改过应拒绝');
  expect(run('--approval', f, '--consume') === 2, '核销必须带链接');
  expect(run('--approval', f, '--consume', '--link', 'https://example.com/p/1') === 0, '核销应成功');
  expect(run(...ok) === 2, '已核销的批准不能复用');
  expect(run('--item', 'W1') === 2, '没有批准记录应拒绝');
  console.log('check-approval tests passed');
} finally {
  fs.rmSync(dir, {recursive: true, force: true});
}
