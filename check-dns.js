import dns from 'dns'

dns.resolve4('justinekems.com', (err, addresses) => {
  console.log('justinekems.com IPv4 addresses:', addresses || err.message)
})

dns.resolve4('www.justinekems.com', (err, addresses) => {
  console.log('www.justinekems.com IPv4 addresses:', addresses || err.message)
})
