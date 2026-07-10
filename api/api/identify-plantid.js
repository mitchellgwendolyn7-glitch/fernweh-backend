// POST /api/identify-plantid
// Body: { "imageBase64": "..." }
// Your Plant.id key lives only in Vercel's environment variables.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  const { imageBase64 } = req.body || {};
  if (!imageBase64) {
    return res.status(400).json({ error: 'Missing imageBase64 in request body' });
  }

  try {
    const params = new URLSearchParams({
      details: 'common_names,url',
      classification_level: 'all'
    });

    const response = await fetch(`https://api.plant.id/v3/identification?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': process.env.PLANTID_API_KEY
      },
      body: JSON.stringify({
        images: [imageBase64],
        similar_images: true
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
