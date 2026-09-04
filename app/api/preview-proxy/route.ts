import { NextRequest, NextResponse } from "next/server";

const WAITING_HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        background: #030712;
        color: #94a3b8;
        font-family: system-ui, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
      }
      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(99, 102, 241, 0.2);
        border-top-color: #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  </head>
  <body>
    <div class="spinner"></div>
    <p style="font-size: 14px; font-weight: 500; color: #f1f5f9;">Starting Sandbox Preview...</p>
    <p style="font-size: 12px; color: #64748b;">Waiting for Next.js preview server on port 4173</p>
    <script>
      setTimeout(() => location.reload(), 2000);
    </script>
  </body>
</html>`;

export async function GET(request: NextRequest) {
  const search = request.nextUrl.search;
  const targetUrl = `http://127.0.0.1:4173/${search}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        accept: request.headers.get("accept") || "*/*",
      },
      cache: "no-store",
    });

    const headers = new Headers(response.headers);
    headers.delete("x-frame-options");
    headers.delete("content-security-policy");

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch {
    return new NextResponse(WAITING_HTML, {
      status: 200,
      headers: { "content-type": "text/html" },
    });
  }
}
