export default async function handler(req, res) {
  // Solo permitir GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.SAMSARA_API_KEY; // ← guardada como variable de entorno
  if (!apiKey) {
    return res.status(500).json({ error: "API key no configurada" });
  }

  try {
    // Obtener todos los vehículos con su ubicación actual
    const samsaraRes = await fetch(
      "https://api.samsara.com/fleet/vehicles/locations?decorations=speed,heading",
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!samsaraRes.ok) {
      const err = await samsaraRes.text();
      return res.status(samsaraRes.status).json({ error: err });
    }

    const data = await samsaraRes.json();

    // Headers CORS para el navegador
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=30"); // cache 30 seg
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
