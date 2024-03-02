import {NextResponse, type NextRequest} from "next/server";
import {createMiddlewareClient} from "@supabase/auth-helpers-nextjs";
import {createClient} from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
    const {supabase, response} = createClient(request)
    const {data} = await supabase.auth.getSession()

    if (data.session) {
        return response
    } else {
        return NextResponse.redirect(new URL('/login?callback=' + request.nextUrl.pathname, request.url))
    }
}

export const config = {
  matcher: '/gallery/:path*',
}
