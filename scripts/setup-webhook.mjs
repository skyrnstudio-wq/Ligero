// scripts/setup-webhook.mjs
// Automates Sanity webhook provisioning for On-Demand ISR

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zqurgqiq';
const token = process.env.SANITY_API_WRITE_TOKEN;
const secret = process.env.SANITY_REVALIDATE_SECRET;

if (!token) {
  console.error('❌ Error: SANITY_API_WRITE_TOKEN is missing in environment.');
  process.exit(1);
}

const args = process.argv.slice(2);

async function listWebhooks() {
  const res = await fetch(`https://api.sanity.io/v2025-02-19/hooks/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const error = await res.text();
    console.error(`❌ Failed to list webhooks (${res.status}):`, error);
    process.exit(1);
  }
  const hooks = await res.json();
  console.log(`\n📋 Current Webhooks for project '${projectId}' (${hooks.length} found):`);
  hooks.forEach((h, i) => {
    console.log(`  [${i + 1}] ID: ${h.id}`);
    console.log(`      Name:    ${h.name}`);
    console.log(`      URL:     ${h.url}`);
    console.log(`      Dataset: ${h.dataset}`);
    console.log(`      Status:  ${h.isDisabled ? 'Disabled' : 'Active'}`);
    console.log('');
  });
  return hooks;
}

async function deleteWebhook(id) {
  const res = await fetch(`https://api.sanity.io/v2025-02-19/hooks/projects/${projectId}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const error = await res.text();
    console.error(`❌ Failed to delete webhook ${id} (${res.status}):`, error);
    process.exit(1);
  }
  console.log(`✔ Webhook ${id} successfully deleted.`);
}

async function createWebhook(rawUrl) {
  let targetUrl = rawUrl.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `https://${targetUrl}`;
  }
  if (!targetUrl.endsWith('/api/revalidate')) {
    targetUrl = targetUrl.replace(/\/$/, '') + '/api/revalidate';
  }

  console.log(`\n🚀 Registering On-Demand ISR Webhook for Ligero Parfum...`);
  console.log(`   Target Endpoint: ${targetUrl}`);
  console.log(`   Project ID:      ${projectId}`);
  console.log(`   Dataset:         production`);
  console.log(`   Secret Config:   ${secret ? 'Protected with HMAC-SHA256 signature' : 'None'}`);

  const payload = {
    type: 'document',
    name: 'Ligero Next.js On-Demand ISR',
    url: targetUrl,
    dataset: 'production',
    apiVersion: 'v2025-02-19',
    httpMethod: 'POST',
    rule: {
      on: ['create', 'update', 'delete'],
      filter: '_type in ["perfume", "houseObject", "homePage", "siteSettings", "legalPage", "customerReview"]',
      projection: '{ _type, "slug": slug.current, "perfumeSlug": perfume->slug.current }'
    },
    ...(secret ? { secret } : {})
  };

  const res = await fetch(`https://api.sanity.io/v2025-02-19/hooks/projects/${projectId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.text();
    console.error(`\n❌ Failed to create webhook (${res.status}):\n${error}`);
    process.exit(1);
  }

  const result = await res.json();
  console.log(`\n✔ Webhook created successfully!`);
  console.log(`   Webhook ID: ${result.id}`);
  console.log(`   Created At: ${result.createdAt}`);
  console.log(`   Rule Filter: ${result.rule?.filter}`);
  console.log(`\nWhen any fragrance, object, homepage, or review is published in Sanity Studio, Sanity will immediately POST to ${targetUrl} to invalidate and re-render the cache.\n`);
}

async function main() {
  if (args.includes('--list') || args.length === 0) {
    await listWebhooks();
    if (args.length === 0) {
      console.log('Usage:');
      console.log('  node --env-file=.env.local scripts/setup-webhook.mjs <https://your-public-url.com>');
      console.log('  node --env-file=.env.local scripts/setup-webhook.mjs --delete <webhook-id>');
      console.log('  node --env-file=.env.local scripts/setup-webhook.mjs --list\n');
    }
    return;
  }

  if (args[0] === '--delete') {
    const id = args[1];
    if (!id) {
      console.error('❌ Please specify webhook ID to delete: --delete <id>');
      process.exit(1);
    }
    await deleteWebhook(id);
    return;
  }

  await createWebhook(args[0]);
}

main().catch(console.error);
