async function check(url) {
  try {
    const res = await fetch(url, { redirect: 'manual' })
    console.log(`URL: ${url}`)
    console.log(`Status: ${res.status}`)
    console.log(`Location Header: ${res.headers.get('location')}`)
    console.log('---')
  } catch (err) {
    console.error(`Error for ${url}:`, err.message)
  }
}

async function run() {
  await check('https://www.justinekems.com/fr/catalogue/tenue-traditionnelle-024')
  await check('https://www.justinekems.com/fr/catalogue/tenue-traditionnelle-024/')
  await check('https://justinekems.com/fr/catalogue/tenue-traditionnelle-024')
  await check('https://justinekems.com/fr/catalogue/tenue-traditionnelle-024/')
}

run()
