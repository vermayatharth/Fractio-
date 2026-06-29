import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createUser, seedDemoInvestments } from "@/lib/auth-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !fullName || !password) {
      return NextResponse.json({ error: "Please provide your full name, email, and password." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const user = await createUser({ email, fullName, password });

    // Seed demo investments so the dashboard isn't empty on first login
    await seedDemoInvestments(user.id as number);

    const cookieStore = await cookies();
    cookieStore.set("fractio_session", String(user.id), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("UNIQUE")) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    console.error("[signup] Account creation failed:", error);
    return NextResponse.json({ error: "Unable to create your account right now." }, { status: 500 });
  }
}
