// app/api/4shared/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  if (!process.env.FOURSHARED_APP_KEY) {
    return NextResponse.json({ error: 'Clave de API no configurada' }, { status: 500 });
  }

  try {
    const res = await fetch('https://search.4shared.com/v1_2/files', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `Bearer ${process.env.FOURSHARED_APP_KEY}`,
        'Cache-Control': 's-maxage=60, stale-while-revalidate',
      },
    });

    if (!res.ok) {
      // Intentamos extraer el error exacto que devuelve 4shared
      let errorMessage = 'Error en la petición a 4shared';
      try {
        const errorData = await res.json(); // Si 4shared devuelve JSON con mensaje
        errorMessage = errorData?.message || JSON.stringify(errorData);
      } catch {
        // Si no es JSON, lo intentamos como texto
        try {
          errorMessage = await res.text();
        } catch {}
      }

      return NextResponse.json(
        {
          error: 'Error desde 4shared',
          status: res.status,
          statusText: res.statusText,
          message: errorMessage,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: err.message || 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
