import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/auth-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Please provide your email and password." }, { status: 400 });
    }

    const user = await verifyUser({ email, password });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("fractio_session", String(user.id), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("[signin] Error:", error);
    return NextResponse.json({ error: "Unable to sign you in right now." }, { status: 500 });
  }
}
