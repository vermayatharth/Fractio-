import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getInvestmentsByUser, addInvestment, getUserById } from "@/lib/auth-db";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("fractio_session")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 401 });
  }

  const investments = getInvestmentsByUser(user.id);
  return NextResponse.json({ investments });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("fractio_session")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const assetName = typeof body?.assetName === "string" ? body.assetName.trim() : "";
    const city = typeof body?.city === "string" ? body.city.trim() : "";
    const investedAmount = Number(body?.investedAmount);
    const currentValue = Number(body?.currentValue);
    const returnsPct = Number(body?.returnsPct) || 0;
    const unitsHeld = Number(body?.unitsHeld) || 1;

    if (!assetName || !city || !investedAmount || !currentValue) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const investment = addInvestment({
      userId: user.id,
      assetName,
      city,
      investedAmount,
      currentValue,
      returnsPct,
      unitsHeld,
    });

    return NextResponse.json({ success: true, investment });
  } catch {
    return NextResponse.json({ error: "Unable to add investment." }, { status: 500 });
  }
}
