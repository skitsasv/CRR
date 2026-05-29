// Netlify Function: strava-auth.js
// Handles Strava OAuth - exchanges code for access token

exports.handler = async (event) => {
  const { code } = event.queryStringParameters || {};

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No code provided' })
    };
  }

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code'
      })
    });

    const data = await response.json();

    if (data.errors) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Strava auth failed', details: data })
      };
    }

    // Return athlete info + tokens to frontend
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        athlete: {
          id: data.athlete.id,
          firstname: data.athlete.firstname,
          lastname: data.athlete.lastname,
          profile: data.athlete.profile,
          city: data.athlete.city,
          country: data.athlete.country
        }
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', message: err.message })
    };
  }
};
