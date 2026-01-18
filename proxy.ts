import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!accessToken && refreshToken) {
    try {
      const responseFromAxios = await checkServerSession();

      const setCookie = responseFromAxios.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        let response;

        if (isPublicRoute) {
          response = NextResponse.redirect(new URL('/', request.url));
        } else {
          response = NextResponse.next();
        }

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          const cookieName = parsed.accessToken
            ? 'accessToken'
            : 'refreshToken';
          const cookieValue = parsed.accessToken || parsed.refreshToken || '';

          response.cookies.set({
            name: cookieName,
            value: cookieValue,
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path || '/',
            maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
          });
        }

        return response;
      }
    } catch (error) {
      console.error('Session refresh failed in middleware:', error);
    }
  }

  if (!accessToken) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
