// app/api/4shared/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const query = body.q;

  if (!query) {
    return NextResponse.json({ error: 'Falta el parámetro de búsqueda' }, { status: 400 });
  }

  try {
    const res = await fetch('https://search.4shared.com/v1_2/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': 'Bearer ' + process.env.FOURSHARED_APP_KEY,
      },
      body: JSON.stringify({
        q: query,
      }),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar la API externa' }, { status: 500 });
  }
}
