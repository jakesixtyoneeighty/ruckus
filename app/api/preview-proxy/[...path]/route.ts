import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await context.params;
  const targetPath = path ? path.join("/") : "";
  const search = request.nextUrl.search;
  const targetUrl = `http://127.0.0.1:4173/${targetPath}${search}`;

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
    return new NextResponse("Preview asset not available", { status: 404 });
  }
}
