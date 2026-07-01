import type { MarketplaceProperty } from "@/lib/mock-data";

export interface PropertyPrediction {
  propertyId: string;
  predictedIRR: number;
  lowerPct: number;
  upperPct: number;
  confidenceLevel: number;
  riskClassification: "conservative" | "moderate" | "aggressive";
  dcfIrr: number;
}

function computeDcfIrr(property: MarketplaceProperty): number {
  const totalValue = property.totalValue;
  const grossRental = totalValue * (property.baseRentalYieldPct / 100.0);
  const cashFlows: number[] = [-totalValue];

  for (let year = 1; year <= 5; year += 1) {
    const escalatedRental = grossRental * Math.pow(1 + property.expectedRentalEscalationPct / 100.0, year);
    const effectiveRental = escalatedRental * (property.occupancyPct / 100.0);
    const maintenance = effectiveRental * 0.15;
    const vacancyLoss = effectiveRental * 0.05;
    const propertyTax = totalValue * 0.005;
    const insurance = totalValue * 0.001;
    const noi = effectiveRental - maintenance - vacancyLoss - propertyTax - insurance;

    if (year < 5) {
      cashFlows.push(noi);
    } else {
      const terminalValue = noi / (property.terminalCapRatePct / 100.0);
      cashFlows.push(noi + terminalValue);
    }
  }

  let irr = 0;
  let guess = 0.1;
  for (let i = 0; i < 100; i += 1) {
    const npv = cashFlows.reduce((sum, cf, idx) => sum + cf / Math.pow(1 + guess, idx), 0);
    const derivative = cashFlows.reduce(
      (sum, cf, idx) => sum - (idx * cf) / Math.pow(1 + guess, idx + 1),
      0
    );
    if (Math.abs(derivative) < 1e-6) break;
    const nextGuess = guess - npv / derivative;
    if (Number.isNaN(nextGuess) || !Number.isFinite(nextGuess)) break;
    if (Math.abs(nextGuess - guess) < 1e-8) {
      guess = nextGuess;
      break;
    }
    guess = nextGuess;
  }

  irr = guess * 100;
  if (!Number.isFinite(irr)) {
    return property.projectedIRR;
  }
  return Math.max(Math.min(irr, 25), 0);
}

function classifyRisk(irr: number, intervalWidth: number): PropertyPrediction["riskClassification"] {
  if (irr >= 10.0 && intervalWidth <= 4.0) {
    return "conservative";
  }
  if (irr < 7.0 || intervalWidth > 6.0) {
    return "aggressive";
  }
  return "moderate";
}

export function predictProperty(property: MarketplaceProperty): PropertyPrediction {
  const dcfIrr = computeDcfIrr(property);
  const additional = (property.baseRentalYieldPct - 8.5) * 0.35 + (property.occupancyPct - 90) * 0.06 + (property.waleYears - 5.5) * 0.3;
  const predictedIRR = Math.round((property.projectedIRR + additional) * 100) / 100;
  const lowerPct = Math.max(predictedIRR - 1.8, 3.0);
  const upperPct = Math.min(predictedIRR + 1.8, 25.0);
  const riskClassification = classifyRisk(predictedIRR, upperPct - lowerPct);

  return {
    propertyId: property.id,
    predictedIRR,
    lowerPct,
    upperPct,
    confidenceLevel: 0.9,
    riskClassification,
    dcfIrr: Math.round(dcfIrr * 100) / 100,
  };
}
