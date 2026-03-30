/**
 * Quick test to verify price parsing from filenames works correctly
 */

import path from 'path'

function parsePriceValue(str) {
  const cleaned = str.replace(/\.$/g, '')
  if (/^\d+\.\d{3}$/.test(cleaned)) {
    return parseInt(cleaned.replace('.', ''), 10)
  }
  if (/^\d+(\.\d{3})+$/.test(cleaned)) {
    return parseInt(cleaned.replace(/\./g, ''), 10)
  }
  return parseInt(cleaned, 10) || 0
}

function parsePrice(filename) {
  const name = path.parse(filename).name

  const coupleRegex = /h\s*(\d+[\d.]*)\s*[;!',]+\s*f\s*(\d+[\d.]*)/i
  const coupleMatch = name.match(coupleRegex)
  if (coupleMatch) {
    return {
      isCouple: true,
      priceH: parsePriceValue(coupleMatch[1]),
      priceF: parsePriceValue(coupleMatch[2]),
    }
  }

  const coupleAltRegex = /^(\d+[\d.]*)\s*[;!',]+\s*f\s*(\d+[\d.]*)/i
  const coupleAltMatch = name.match(coupleAltRegex)
  if (coupleAltMatch) {
    return {
      isCouple: true,
      priceH: parsePriceValue(coupleAltMatch[1]),
      priceF: parsePriceValue(coupleAltMatch[2]),
    }
  }

  const singleRegex = /^(\d+[\d.]*)/
  const singleMatch = name.match(singleRegex)
  if (singleMatch) {
    return { isCouple: false, price: parsePriceValue(singleMatch[1]) }
  }

  return { isCouple: false, price: 0 }
}

// Test cases
const tests = [
  // Single prices
  { file: '350.000 FG.jpg', expected: '350000' },
  { file: '150.000.jpeg', expected: '150000' },
  { file: '250.000c.jpg', expected: '250000' },
  { file: '75.000 P.jpg', expected: '75000' },
  { file: '500.000.jpg', expected: '500000' },
  { file: '1000162800.jpg', expected: '1000162800' },
  // Couple prices
  { file: 'h120.000 ; f250.000.jpg', expected: 'H:120000/F:250000' },
  { file: 'h140.000 ! f210.000.jpg', expected: 'H:140000/F:210000' },
  { file: 'h120.000;; f140.000.jpg', expected: 'H:120000/F:140000' },
  { file: 'h130.000 ; f200.000.jpeg', expected: 'H:130000/F:200000' },
  { file: "h130.000 '' f275.000.jpg", expected: 'H:130000/F:275000' },
  { file: 'h140.000 ; f300.000.jpeg', expected: 'H:140000/F:300000' },
  { file: '75000; f160.000.jpg', expected: 'H:75000/F:160000' },
  { file: 'f300.000; h160.000.jpg', expected: '300000' }, // tricky one, f before h
]

console.log('Price Parsing Test Results:')
console.log('─'.repeat(60))

let pass = 0, fail = 0
for (const t of tests) {
  const result = parsePrice(t.file)
  let actual
  if (result.isCouple) {
    actual = `H:${result.priceH}/F:${result.priceF}`
  } else {
    actual = `${result.price}`
  }
  const ok = actual === t.expected
  console.log(`${ok ? '✅' : '❌'} "${t.file}"`)
  console.log(`   Expected: ${t.expected}`)
  console.log(`   Got:      ${actual}`)
  if (ok) pass++; else fail++
}

console.log('─'.repeat(60))
console.log(`Results: ${pass} passed, ${fail} failed`)
