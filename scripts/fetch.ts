import { createClient } from '@sanity/client';
const client = createClient({ projectId: 'd8v5zxvs', dataset: 'production', apiVersion: '2024-03-18', useCdn: false });
client.fetch('*[_type == "pageServices"][0]').then(res => console.log(JSON.stringify(res, null, 2)));
