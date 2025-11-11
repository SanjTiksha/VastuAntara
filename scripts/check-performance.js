#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const REPORT_PATH = process.argv[2] ?? './lighthouse-report.report.json'
const LCP_THRESHOLD_MS = 3000
const JS_BUNDLE_THRESHOLD_BYTES = 500 * 1024 // 500 kB

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`
}

function readReport(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Lighthouse report not found at ${absolutePath}`)
  }

  const raw = fs.readFileSync(absolutePath, 'utf8')
  try {
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(`Unable to parse Lighthouse JSON report: ${error.message}`)
  }
}

function getLargestContentfulPaint(report) {
  const audit = report?.audits?.['largest-contentful-paint']
  if (!audit || typeof audit.numericValue !== 'number') {
    throw new Error('Lighthouse report missing largest-contentful-paint audit')
  }
  return audit.numericValue
}

function getJavaScriptBytes(report) {
  const scriptAudit = report?.audits?.['script-treemap-data']
  const nodes = scriptAudit?.details?.nodes
  if (Array.isArray(nodes)) {
    const total = nodes.reduce((sum, node) => {
      const resourceType = node?.node?.resourceType ?? node?.resourceType
      const resourceBytes = node?.node?.resourceBytes ?? node?.resourceBytes
      if (resourceType === 'Script' && typeof resourceBytes === 'number') {
        return sum + resourceBytes
      }
      return sum
    }, 0)

    if (total > 0) {
      return total
    }
  }

  const fallback = report?.audits?.['total-byte-weight']?.numericValue
  if (typeof fallback === 'number') {
    return fallback
  }

  throw new Error('Unable to determine JavaScript byte size from Lighthouse report')
}

function main() {
  const report = readReport(REPORT_PATH)
  const lcpMs = getLargestContentfulPaint(report)
  const jsBytes = getJavaScriptBytes(report)

  const results = [
    { name: 'Largest Contentful Paint', value: `${(lcpMs / 1000).toFixed(2)} s`, threshold: `${LCP_THRESHOLD_MS / 1000} s`, pass: lcpMs <= LCP_THRESHOLD_MS },
    { name: 'JavaScript transfer size', value: formatKb(jsBytes), threshold: `${formatKb(JS_BUNDLE_THRESHOLD_BYTES)}`, pass: jsBytes <= JS_BUNDLE_THRESHOLD_BYTES },
  ]

  results.forEach(result => {
    const status = result.pass ? 'PASS' : 'FAIL'
    console.log(`${status}: ${result.name} = ${result.value} (threshold ${result.threshold})`)
  })

  const failed = results.filter(result => !result.pass)
  if (failed.length > 0) {
    const messages = failed.map(result => `${result.name} exceeded threshold (${result.value} > ${result.threshold})`)
    throw new Error(`Performance budget violated:\n${messages.join('\n')}`)
  }

  console.log('Performance budgets satisfied ✅')
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
