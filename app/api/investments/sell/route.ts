import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getUserById,
  getInvestmentById,
  updateInvestment,
  adjustUserBalance,
  deleteInvestmentById,
} from "@/lib/auth-db";

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
    const investmentId = Number(body?.investmentId);
    const unitsToSell = Number(body?.unitsToSell);
    const sellPricePerUnit = Number(body?.sellPricePerUnit);

    if (!investmentId || unitsToSell <= 0 || sellPricePerUnit <= 0) {
      return NextResponse.json({ error: "Missing or invalid sell parameters." }, { status: 400 });
    }

    const investment = await getInvestmentById(investmentId, user.id as number);
    if (!investment) {
      return NextResponse.json({ error: "Investment not found." }, { status: 404 });
    }

    if (unitsToSell > investment.units_held) {
      return NextResponse.json({ error: "Not enough units held to sell." }, { status: 400 });
    }

    const saleProceeds = unitsToSell * sellPricePerUnit;
    const remainingUnits = investment.units_held - unitsToSell;

    if (remainingUnits > 0) {
      const unitCost = investment.invested_amount / investment.units_held;
      const remainingInvestedAmount = unitCost * remainingUnits;
      const remainingCurrentValue = (investment.current_value / investment.units_held) * remainingUnits;
      const updatedReturnsPct = remainingInvestedAmount > 0
        ? ((remainingCurrentValue - remainingInvestedAmount) / remainingInvestedAmount) * 100
        : 0;

      const updatedInvestment = await updateInvestment({
        id: investment.id,
        investedAmount: remainingInvestedAmount,
        currentValue: remainingCurrentValue,
        returnsPct: updatedReturnsPct,
        unitsHeld: remainingUnits,
      });

      await adjustUserBalance(user.id as number, saleProceeds);
      return NextResponse.json({ success: true, updatedInvestment, saleProceeds });
    }

    await deleteInvestmentById(investment.id);
    await adjustUserBalance(user.id as number, saleProceeds);

    return NextResponse.json({ success: true, saleProceeds });
  } catch (error) {
    console.error("[sell] error", error);
    return NextResponse.json({ error: "Unable to process sell order." }, { status: 500 });
  }
}
