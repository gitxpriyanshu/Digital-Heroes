import { createServerClient, type CookieOptions } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Protected routes
  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname.startsWith('/admin');

  if (isDashboard || isAdmin) {
    if (!session) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Check Admin Role
    if (isAdmin) {
      const userRole = session.user.app_metadata?.role;
      if (userRole !== 'admin') {
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    }

    // Check Subscription and Charity Status from Secure JWT payload (Zero-DB lookup)
    if (isDashboard) {
      const isSubscribed = session.user.user_metadata?.is_subscribed === true;
      const hasCharity = session.user.user_metadata?.has_charity === true;

      if (!isSubscribed) {
        url.searchParams.set('redirect', pathname);
        url.pathname = '/subscribe';
        return NextResponse.redirect(url);
      }

      // If subscribed but no charity, forces them to select charity (excluding the charity selection page itself)
      if (isSubscribed && !hasCharity && pathname !== '/dashboard/charity') {
        url.searchParams.set('forced', 'true');
        url.pathname = '/dashboard/charity';
        return NextResponse.redirect(url);
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
