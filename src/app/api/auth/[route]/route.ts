import { ACCESS_TOKEN_KEY } from "@/utils/constant";
import httpClient from "@/src/utils/httpClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

//GET
export async function GET(
    request: NextRequest,
    context: {
        params: {
            route: string;
        };
    }
): Promise<any> {
    const route = context.params.route;
    if(route === "signout"){
        return signout(request);
    }else if(route === "session"){
        return getSession(request);
    }
    return NextResponse.json({ route });
}

//POST
export async function POST(
    request: NextRequest,
    context: {
        params: {
            route: string;
        };
    }
): Promise<any> {
    const route = context.params.route;
    const body = await request.json();
    if(route === "signin"){
        return signIn(body);
    }
}

async function signIn(body: {
    username: string;
    password: string;
}): Promise<any> {
    try{
        const response = await httpClient.post(`/authen/login`, body);
        const { token } = response.data;
        (await cookies()).set(ACCESS_TOKEN_KEY, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            path: "/",
        });
        return NextResponse.json(response.data);
    } catch{
        return NextResponse.json({result: "nok"});
    }
}

async function signout(request: NextRequest) {
    const cookieStore = cookies();
    (await cookieStore).delete(ACCESS_TOKEN_KEY);
    return NextResponse.json({ result: "ok" });
}

async function getSession(req: NextRequest) {
    try{
        const cookieStore = cookies();
        const accessTokenKey = (await cookieStore).get(ACCESS_TOKEN_KEY);
        if(!!accessTokenKey?.value){
            const response = await httpClient.get(`/authen/profile`,{
                headers: {Authorization: `Bearer ${accessTokenKey?.value}`},
            });
            return NextResponse.json(response.data);
        }else{
            return NextResponse.json({result: "nok"});
        }
    }catch(error){
        return NextResponse.json({result: "nok"});
    }
}