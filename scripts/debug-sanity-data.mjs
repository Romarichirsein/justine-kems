import { createClient } from '@sanity/client';
const client = createClient({
  projectId: 'd8v5zxvs',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
});
async function test() {
  const data = await client.fetch('*[_type == "catalogue"][0...3]');
  console.log(JSON.stringify(data, null, 2));
}
test();
