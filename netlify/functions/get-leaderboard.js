// netlify/functions/get-leaderboard.js
// Φέρνει leaderboard για συγκεκριμένο αγώνα
exports.handler = async (event) => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  const race_id = event.queryStringParameters?.race_id;
  const distance = event.queryStringParameters?.distance;

  if (!race_id) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'race_id required' }) };
  }

  let url = `${SUPABASE_URL}/rest/v1/race_results?race_id=eq.${race_id}&verified=eq.true&order=finish_time.asc&select=*`;
  if (distance) url += `&distance_label=eq.${encodeURIComponent(distance)}`;

  try {
    const res = await fetch(url, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
