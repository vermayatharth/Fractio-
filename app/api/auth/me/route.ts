import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserById } from "@/lib/auth-db";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("fractio_session")?.value;

  if (!userId) {
    return NextResponse.json({ user: null });
  }

  const user = getUserById(userId);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user });
}
