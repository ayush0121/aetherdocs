import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup')
    const isOnProtectedPage = req.nextUrl.pathname.startsWith('/profile') || req.nextUrl.pathname === '/settings'

    if (isOnProtectedPage && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (isOnAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL('/', req.url))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
