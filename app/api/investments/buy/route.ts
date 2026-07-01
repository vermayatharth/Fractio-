import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserById, addInvestment, adjustUserBalance } from "@/lib/auth-db";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("fractio_session")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = await getUserById(userId);
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

    if (!assetName || !city || investedAmount <= 0 || currentValue <= 0 || unitsHeld <= 0) {
      return NextResponse.json({ error: "Missing or invalid required fields." }, { status: 400 });
    }

    if (user.availableBalance < investedAmount) {
      return NextResponse.json(
        { error: "Insufficient available balance to complete this purchase." },
        { status: 402 }
      );
    }

    await adjustUserBalance(user.id as number, -investedAmount);

    const investment = await addInvestment({
      userId: user.id as number,
      assetName,
      city,
      investedAmount,
      currentValue,
      returnsPct,
      unitsHeld,
    });

    return NextResponse.json({ success: true, investment });
  } catch (error) {
    console.error("[buy] error", error);
    return NextResponse.json({ error: "Unable to process purchase." }, { status: 500 });
  }
}
