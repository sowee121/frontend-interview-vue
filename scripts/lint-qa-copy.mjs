#!/usr/bin/env node
/**
 * 扫描题库文案：过长段落、连续大写缩写、常见未配对缩写。
 * 只读检查，不修改 JSON。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const JSON_DIR = path.join(__dirname, '../src/data/qa/json')

/** 若同段已含中文释义则视为已解释 */
const PAIRED_HINTS = [
  /跨站脚本|XSS/i,
  /跨站请求伪造|CSRF/i,
  /内容安全策略|CSP/i,
  /暂时性死区|TDZ/i,
  /同步报文|SYN/i,
  /确认报文|ACK/i,
  /域名解析|DNS/i,
  /传输层安全|TLS/i,
  /服务端渲染|SSR/i,
  /客户端渲染|CSR/i,
  /热模块替换|HMR/i,
]

/** 叙述里像教材伪代码的写法（编程题整段 code 答案跳过） */
const PSEUDO_CODE = [
  { re: /\bawait\s+expr\b/i, label: 'await expr' },
  { re: /\bexpr\b/i, label: 'expr' },
  { re: /下一节\s*resolve/i, label: '下一节 resolve' },
  { re: /resolve\s*\(\s*该/i, label: 'resolve(该值)' },
  { re: /\bsuccess\s*回调/i, label: 'success 回调' },
  {
    re: /pending\s*的\s*Promise/i,
    label: 'pending 的 Promise',
    allow: /永远\s*pending|pending\s*（|等待中\s*（\s*pending/i,
  },
  { re: /\bexecutor\s*\(/i, label: 'executor(' },
  {
    re: /\bGC\b/,
    label: '裸写 GC',
    allow: /垃圾回收/,
  },
  { re: /(?:延迟|阻止|不阻止)\s*GC/i, label: '延迟/阻止 GC' },
]

const BARE_ACRONYMS = [
  'SYN',
  'ACK',
  'ESTABLISHED',
  'QUIC',
  'FOIT',
  'FOUT',
  'CSSOM',
  'TDZ',
  'CSRF',
  'CSP',
  'HMR',
  'PromiseLike',
  'settled',
  'iterable',
]

function collectText(item) {
  const parts = []
  if (item.questionNote) parts.push(item.questionNote)
  for (const para of item.answer ?? []) {
    for (const seg of para) {
      if (seg.type === 'text' || seg.type === 'strong') parts.push(seg.value)
      if (seg.type === 'code') parts.push(seg.value)
    }
  }
  return parts.join('\n')
}

function hasChineseContext(text, acronym) {
  if (PAIRED_HINTS.some((re) => re.test(text))) return true
  // 同段内 acronym 前有中文（至少 2 字）
  const idx = text.indexOf(acronym)
  if (idx <= 0) return false
  const before = text.slice(Math.max(0, idx - 24), idx)
  return /[\u4e00-\u9fff]{2,}/.test(before)
}

function lintFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const base = path.basename(filePath)
  const issues = []

  for (const field of ['description', 'lead']) {
    const t = data[field] ?? ''
    if (t.length > 80 && !/[\u4e00-\u9fff]/.test(t.slice(0, 20))) {
      issues.push({ file: base, id: '(chapter)', kind: 'lead/description', snippet: t.slice(0, 60) })
    }
  }

  for (const item of data.items ?? []) {
    const full = collectText(item)
    const isCodeOnlyAnswer = item.answer?.every(
      (p) => p.length === 1 && p[0]?.type === 'code',
    )
    if (!isCodeOnlyAnswer) {
      const narrative = (item.answer ?? [])
        .flatMap((para) => para.filter((s) => s.type === 'text' || s.type === 'strong'))
        .map((s) => s.value)
        .join('\n')
      const note = item.questionNote ?? ''
      for (const { re, label, allow } of PSEUDO_CODE) {
        const hit = re.test(narrative) || re.test(note)
        if (!hit) continue
        if (allow && (allow.test(narrative) || allow.test(note))) continue
        issues.push({ file: base, id: item.id, kind: 'pseudo-code', snippet: label })
      }
    }
    for (const segs of item.answer ?? []) {
      const paraText = segs.map((s) => s.value).join('')
      const isSingleCodePara = segs.length === 1 && segs[0]?.type === 'code'
      const isCodeOnlyAnswer =
        item.answer?.every((p) => p.length === 1 && p[0]?.type === 'code') ?? false
      if (!isSingleCodePara && !isCodeOnlyAnswer && paraText.replace(/\s/g, '').length > 140) {
        issues.push({
          file: base,
          id: item.id,
          kind: 'long-paragraph',
          snippet: paraText.slice(0, 80) + '…',
        })
      }
      if (/；[2-9]\d*）/.test(paraText)) {
        issues.push({
          file: base,
          id: item.id,
          kind: 'inline-numbered-steps',
          snippet: '段内仍含 ；2） 类连接符，应拆 answer[]',
        })
      }
    }

    const capsRun = full.match(/\b[A-Z]{2,6}\b(?:\s*[→、/]\s*\b[A-Z]{2,6}\b){2,}/)
    if (capsRun && !hasChineseContext(full, capsRun[0].slice(0, 3))) {
      issues.push({
        file: base,
        id: item.id,
        kind: 'acronym-chain',
        snippet: capsRun[0],
      })
    }

    for (const ac of BARE_ACRONYMS) {
      if (!full.includes(ac)) continue
      if (!hasChineseContext(full, ac) && full.includes(ac)) {
        const inCodeOnly = item.answer?.every((para) =>
          para.every((s) => s.type === 'code' || !s.value.includes(ac)),
        )
        if (!inCodeOnly && /(?:^|[\s，；。])/.test(full)) {
          issues.push({
            file: base,
            id: item.id,
            kind: 'bare-acronym',
            snippet: ac,
          })
        }
      }
    }
  }

  return issues
}

const all = fs
  .readdirSync(JSON_DIR)
  .filter((f) => f.endsWith('.json'))
  .flatMap((f) => lintFile(path.join(JSON_DIR, f)))

if (all.length === 0) {
  console.log('lint-qa-copy: OK (no issues)')
  process.exit(0)
}

console.log(`lint-qa-copy: ${all.length} issue(s)\n`)
for (const i of all) {
  console.log(`[${i.kind}] ${i.file} :: ${i.id}`)
  console.log(`  ${i.snippet}\n`)
}
process.exit(1)
