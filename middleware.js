import { NextResponse } from "next/server";

// Ortam değişkenini alıyoruz, eğer gelmezse güvenlik için bir varsayılan (fallback) ekledim
const ADMIN_SECRET_PATH =
  process.env.NEXT_PUBLIC_ADMIN_PATH || "panel-k9x3m7vw2q";

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. ADIM: Gizli yola (/panel-...) gelen isteği arka planda /admin'e yönlendir
  if (
    pathname === `/${ADMIN_SECRET_PATH}` ||
    pathname.startsWith(`/${ADMIN_SECRET_PATH}/`)
  ) {
    const newPath = pathname.replace(`/${ADMIN_SECRET_PATH}`, "/admin");
    const url = request.nextUrl.clone();
    url.pathname = newPath;

    // Güvenli işaret ekliyoruz ki birazdan engele takılmasın
    url.searchParams.set("internal", "true");

    return NextResponse.rewrite(url);
  }

  // 2. ADIM: Eğer /admin'e geliniyorsa ve 'internal' işareti yoksa 404 döndür
  if (pathname.startsWith("/admin")) {
    const isInternal = searchParams.get("internal") === "true";

    if (!isInternal) {
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
