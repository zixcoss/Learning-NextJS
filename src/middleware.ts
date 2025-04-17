import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_KEY } from "./utils/constant";

// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {
    const cookieStore = cookies();
    const accessTokenKey = (await cookieStore).get(ACCESS_TOKEN_KEY);
    // const requestHeader = new Headers(request.headers);
    // requestHeader.set("x-next-pathname", request.nextUrl.pathname);
    const path = request.nextUrl.pathname;

    if(accessTokenKey && accessTokenKey.value){
        if(path == "/login" || path == "/register" || path == "/"){
            return NextResponse.redirect(new URL("/stock", request.url));
        }
        return NextResponse.next({
            request,
        });
    }else if(path != "/login" && path != "/register"){
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next({
        request,
    });
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/((?!|_next/static|_next/image|favicon.ico).*)"],
};