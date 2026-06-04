// netlify/functions/upsert-user.js
// Δημιουργεί ή ενημερώνει user μετά το Strava login
exports.handler = async (event) => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { strava_id, name, city, avatar_url, strava_token } = JSON.parse(event.body);

    // Upsert: αν υπάρχει strava_id ενημέρωσε, αλλιώς δημιούργησε
    const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify({ strava_id, name, city, avatar_url, strava_token })
    });
    const data = await res.json();
    return { statusCode: 200, headers, body: JSON.stringify(data[0] || data) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
