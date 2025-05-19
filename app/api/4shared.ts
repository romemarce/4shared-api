// pages/api/4shared.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://search.4shared.com/v1_2/files', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `Bearer ${process.env.FOURSHARED_APP_KEY}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Algo salió mal' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor interno' });
  }
}
