// Netlify Function: strava-activities.js
// Fetches athlete's recent activities from Strava

exports.handler = async (event) => {
  const { access_token, per_page = 60 } = event.queryStringParameters || {};

  if (!access_token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'No access token' })
    };
  }

  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=${per_page}`,
      {
        headers: { 'Authorization': `Bearer ${access_token}` }
      }
    );

    const activities = await response.json();

    // Return simplified activity data
    const simplified = activities.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      distance: a.distance,           // meters
      moving_time: a.moving_time,     // seconds
      elapsed_time: a.elapsed_time,
      total_elevation_gain: a.total_elevation_gain,
      start_date: a.start_date,
      start_latlng: a.start_latlng,
      end_latlng: a.end_latlng,
      average_speed: a.average_speed, // m/s
      map: a.map?.summary_polyline    // encoded route
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simplified)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', message: err.message })
    };
  }
};
