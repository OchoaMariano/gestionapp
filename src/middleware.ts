import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Rutas que requieren rol de admin
    const adminRoutes = [
      '/clients/new',
      '/payments/new',
      '/expenses/new',
      '/taxes/new',
    ];

    // Rutas de solo lectura (permitidas para usuarios normales)
    const readOnlyRoutes = [
      '/dashboard',
      '/clients',
      '/payments',
      '/expenses',
      '/taxes',
    ];

    // Si el usuario no es admin y trata de acceder a rutas de admin
    if (token?.role !== 'admin' && adminRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Si el usuario no tiene un rol válido
    if (!readOnlyRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/payments/:path*",
    "/expenses/:path*",
    "/taxes/:path*",
  ],
}; 