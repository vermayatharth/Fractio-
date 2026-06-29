import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserPortfolioSummary, getUserById } from "@/lib/auth-db";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("fractio_session")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 401 });
  }

  const summary = await getUserPortfolioSummary(user.id as number);
  return NextResponse.json({ summary });
}
