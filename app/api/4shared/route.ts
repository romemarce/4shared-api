// app/api/4shared/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://search.4shared.com/v1_2/files', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `Bearer ${process.env.FOURSHARED_APP_KEY}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Error en la petición a 4shared' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
