// app/api/4shared/route.ts
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const oauth = new OAuth({
  consumer: {
    key: process.env.FOURSHARED_CONSUMER_KEY!,
    secret: process.env.FOURSHARED_CONSUMER_SECRET!,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString, key) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64');
  },
});

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') || 'test';
  const url = `https://api.4shared.com/v1_2/files`;

  const requestData = {
    url: `${url}?query=${encodeURIComponent(query)}`,
    method: 'GET',
  };

  const headers = oauth.toHeader(oauth.authorize(requestData));

  try {
    const res = await fetch(requestData.url, {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/octet-stream',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        error: data?.message || 'Error desde 4shared',
        status: res.status,
        details: data,
      }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
