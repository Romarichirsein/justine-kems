/**
 * Quick test to verify price parsing from filenames works correctly
 */

import path from 'path'

function parsePriceValue(str) {
  return parseInt(str.replace(/\./g, ''), 10) || 0
}

function parsePrice(filename) {
  const name = path.parse(filename).name.toLowerCase().trim()

  // 1. Couple Regex (any order)
  const coupleMatch = name.match(/([hf])\s*([\d.]+)\s*[;!',\s]+\s*([hf])\s*([\d.]+)/i)
  if (coupleMatch) {
    const p1 = { t: coupleMatch[1].toLowerCase(), v: parsePriceValue(coupleMatch[2]) }
    const p2 = { t: coupleMatch[3].toLowerCase(), v: parsePriceValue(coupleMatch[4]) }
    const priceH = p1.t === 'h' ? p1.v : p2.v
    const priceF = p1.t === 'f' ? p1.v : p2.v
    return { isCouple: true, priceH, priceF }
  }

  // Alternative couple format (starting with number, assuming H, then ; f...)
  const coupleAltMatch = name.match(/^(\d+[\d.]*)\s*[;!',\s]+\s*f\s*(\d+[\d.]*)/i)
  if (coupleAltMatch) {
    return {
      isCouple: true,
      priceH: parsePriceValue(coupleAltMatch[1]),
      priceF: parsePriceValue(coupleAltMatch[2]),
    }
  }

  // 2. Single Regex
  // Find the first number sequence
  const numberMatch = name.match(/[\d.]+/)
  if (numberMatch) {
    const price = parsePriceValue(numberMatch[0])
    // Look for suffix immediately after or anywhere in the name
    // But user rules: only 'f' and 'h' matter.
    // If it's 150000f, suffix is 'f'.
    // If it's f150000, suffix is 'f'.
    let gender = null
    if (name.includes('f')) gender = 'F'
    else if (name.includes('h')) gender = 'H'

    return { isCouple: false, price, gender }
  }

  return { isCouple: false, price: 0 }
}

// Test cases
const tests = [
  // User specific cases
  { file: '150000a.jpg', expected: '150000' },
  { file: '150000f.jpg', expected: '150000 (F)' },
  { file: '150000H.jpg', expected: '150000 (H)' },
  { file: '150.000cc.jpg', expected: '150000' },
  // Existing cases
  { file: '350.000 FG.jpg', expected: '350000' },
  { file: '150.000.jpeg', expected: '150000' },
  { file: '250.000c.jpg', expected: '250000' },
  { file: '75.000 P.jpg', expected: '75000' },
  { file: '500.000.jpg', expected: '500000' },
  // Couple prices
  { file: 'h120.000 ; f250.000.jpg', expected: 'H:120000/F:250000' },
  { file: 'f300.000; h160.000.jpg', expected: 'H:160000/F:300000' }, // fixed expected if needed
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
    actual = `${result.price}${result.gender ? ` (${result.gender})` : ''}`
  }
  const ok = actual === t.expected
  console.log(`${ok ? '✅' : '❌'} "${t.file}"`)
  console.log(`   Expected: ${t.expected}`)
  console.log(`   Got:      ${actual}`)
  if (ok) pass++; else fail++
}

console.log('─'.repeat(60))
console.log(`Results: ${pass} passed, ${fail} failed`)
