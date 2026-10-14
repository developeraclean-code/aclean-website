// Read-only Google Ads/GA4 diagnostics. Credentials stay in a local env file.
const args = new Set(process.argv.slice(2));
const useAds = args.has('--ads');
const useGA4 = args.has('--ga4') || !useAds;
const required = ['GOOGLE_OAUTH_ACCESS_TOKEN'];
if (useGA4) required.push('GOOGLE_ANALYTICS_PROPERTY_ID');
if (useAds) required.push('GOOGLE_ADS_DEVELOPER_TOKEN', 'GOOGLE_ADS_CUSTOMER_ID', 'GOOGLE_ADS_API_VERSION');
const missing = required.filter(name => !process.env[name]?.trim());
if (missing.length) {
  console.error('Koneksi belum siap. Isi variabel berikut di .env.local: ' + missing.join(', '));
  process.exit(2);
}

const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim();
const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID?.replace(/-/g, '').trim();
const version = process.env.GOOGLE_ADS_API_VERSION?.trim();
if ((useGA4 && !/^\d+$/.test(propertyId)) ||
    (useAds && (!/^\d{10}$/.test(customerId) || !/^v\d+$/.test(version)))) {
  console.error('Property ID harus numerik; customer ID 10 digit; API version berbentuk vNN.');
  process.exit(2);
}
if (args.has('--check')) {
  console.log('Variabel tersedia. Belum menguji izin/masa berlaku token; tidak ada request dikirim.');
  process.exit(0);
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {Authorization: 'Bearer ' + process.env.GOOGLE_OAUTH_ACCESS_TOKEN, ...options.headers},
    signal: AbortSignal.timeout(30000)
  });
  const json = await response.json();
  if (!response.ok) throw new Error('Google API HTTP ' + response.status + ' (' + (json.error?.status || 'request_failed') + ')');
  return json;
}

async function listGA4(resource) {
  const result = [];
  let pageToken = '';
  do {
    const url = new URL('https://analyticsadmin.googleapis.com/v1beta/properties/' + propertyId + '/' + resource);
    url.searchParams.set('pageSize', '200');
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const body = await request(url);
    result.push(...(body[resource] || []));
    pageToken = body.nextPageToken || '';
  } while (pageToken);
  return result;
}

async function queryAds(query) {
  const headers = {'Content-Type': 'application/json', 'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN};
  const manager = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, '').trim();
  if (manager) {
    if (!/^\d{10}$/.test(manager)) throw new Error('Login customer ID harus 10 digit.');
    headers['login-customer-id'] = manager;
  }
  const batches = await request('https://googleads.googleapis.com/' + version + '/customers/' + customerId + '/googleAds:searchStream', {
    method: 'POST', headers, body: JSON.stringify({query})
  });
  return batches.flatMap(batch => batch.results || []);
}

try {
  if (useGA4) {
    const [keys, links] = await Promise.all([listGA4('keyEvents'), listGA4('googleAdsLinks')]);
    console.log(JSON.stringify({type: 'GA4', propertyId,
      keyEvents: keys.map(k => ({eventName: k.eventName, countingMethod: k.countingMethod})),
      googleAdsLinks: links.map(l => ({customerId: l.customerId, canManageClients: l.canManageClients})),
      note: 'Keberadaan Key Event belum membuktikan import, Primary, atau data conversion di Google Ads.'
    }, null, 2));
  }
  if (useAds) {
    const campaign = (process.env.GOOGLE_ADS_CAMPAIGN_NAME || 'DCT - Ducting AC').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const filter = "campaign.name = '" + campaign + "'";
    const queries = {
      campaign: 'SELECT campaign.id, campaign.name, campaign.status, campaign.primary_status, campaign.primary_status_reasons, campaign.bidding_strategy_type, campaign.start_date, campaign.end_date, campaign_budget.amount_micros FROM campaign WHERE ' + filter,
      adGroups: 'SELECT campaign.name, ad_group.id, ad_group.name, ad_group.status, ad_group.cpc_bid_micros FROM ad_group WHERE ' + filter,
      ads: 'SELECT ad_group.name, ad_group_ad.status, ad_group_ad.ad.id, ad_group_ad.ad.final_urls, ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.review_status FROM ad_group_ad WHERE ' + filter,
      keywords: 'SELECT ad_group.name, ad_group_criterion.status, ad_group_criterion.negative, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.cpc_bid_micros, ad_group_criterion.system_serving_status FROM keyword_view WHERE ' + filter,
      daily: 'SELECT segments.date, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.all_conversions FROM campaign WHERE ' + filter + ' AND segments.date DURING LAST_7_DAYS ORDER BY segments.date',
      today: 'SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM campaign WHERE ' + filter + ' AND segments.date DURING TODAY',
      conversionActions: 'SELECT conversion_action.id, conversion_action.name, conversion_action.status, conversion_action.type, conversion_action.primary_for_goal, conversion_action.category FROM conversion_action WHERE conversion_action.status != REMOVED',
      campaignGoals: 'SELECT campaign.name, campaign_conversion_goal.category, campaign_conversion_goal.origin, campaign_conversion_goal.biddable FROM campaign_conversion_goal WHERE ' + filter,
      schedule: 'SELECT campaign.name, campaign_criterion.ad_schedule.day_of_week, campaign_criterion.ad_schedule.start_hour, campaign_criterion.ad_schedule.end_hour FROM campaign_criterion WHERE ' + filter + ' AND campaign_criterion.type = AD_SCHEDULE',
      locations: 'SELECT campaign.name, campaign_criterion.negative, campaign_criterion.location.geo_target_constant FROM campaign_criterion WHERE ' + filter + ' AND campaign_criterion.type = LOCATION'
    };
    for (const [section, query] of Object.entries(queries)) {
      try { console.log(JSON.stringify({type: 'Google Ads', section, results: await queryAds(query)}, null, 2)); }
      catch (error) { console.error(section + ': ' + error.message); process.exitCode = 1; }
    }
  }
} catch (error) {
  console.error('Audit gagal: ' + error.message);
  process.exitCode = 1;
}
