/**
 * Fractio — Mock Data for Dashboard UI
 *
 * Realistic Indian commercial real estate data modeled on
 * Grade-A properties in Tier-1 metro cities.
 * All values in INR, SEBI SM REIT compliant ranges.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  unrealisedGainPct: number;
  quarterlyYield: number;
  availableBalance?: number;
}

export interface Holding {
  id: string;
  propertyName: string;
  schemeName: string;
  city: string;
  unitsHeld: number;
  avgBuyPrice: number;
  currentPrice: number;
  fiveYrIRR: number;
  plPct: number;
  concentrationPct: number;
  totalUnitsInFloat: number;
}

export interface MarketplaceProperty {
  id: string;
  schemeName: string;
  propertyName: string;
  city: string;
  state: string;
  cityTier: "tier_1" | "tier_2" | "tier_3";
  totalValueCr: number;
  totalValue: number;
  projectedIRR: number;
  dividendYield: number;
  baseRentalYieldPct: number;
  minInvestment: number;
  pricePerUnit: number;
  totalUnits: number;
  publicFloatUnits: number;
  occupancyPct: number;
  waleYears: number;
  assetGrade: string;
  carpetAreaSqft: number;
  rbiRepoRatePct: number;
  expectedRentalEscalationPct: number;
  terminalCapRatePct: number;
  imageUrl: string;
}

// ---------------------------------------------------------------------------
// Portfolio Summary
// ---------------------------------------------------------------------------

export const portfolioSummary: PortfolioSummary = {
  totalInvested: 48_50_000,
  currentValue: 53_12_400,
  unrealisedGainPct: 9.53,
  quarterlyYield: 1_06_248,
};

// ---------------------------------------------------------------------------
// Holdings
// ---------------------------------------------------------------------------

export const holdings: Holding[] = [
  {
    id: "asset-001",
    propertyName: "Embassy Manyata Tech Park — Block G",
    schemeName: "Fractio Embassy SPV I",
    city: "Bangalore",
    unitsHeld: 150,
    avgBuyPrice: 10_500,
    currentPrice: 11_420,
    fiveYrIRR: 11.2,
    plPct: 8.76,
    concentrationPct: 18.75,
    totalUnitsInFloat: 800,
  },
  {
    id: "asset-002",
    propertyName: "Prestige Tech Park — Tower 9",
    schemeName: "Fractio Prestige SPV II",
    city: "Bangalore",
    unitsHeld: 100,
    avgBuyPrice: 12_000,
    currentPrice: 12_960,
    fiveYrIRR: 10.8,
    plPct: 8.0,
    concentrationPct: 10.0,
    totalUnitsInFloat: 1000,
  },
  {
    id: "asset-003",
    propertyName: "DLF Cyber City — Horizon Centre",
    schemeName: "Fractio DLF SPV III",
    city: "Gurugram",
    unitsHeld: 80,
    avgBuyPrice: 14_200,
    currentPrice: 13_820,
    fiveYrIRR: 9.4,
    plPct: -2.68,
    concentrationPct: 8.0,
    totalUnitsInFloat: 1000,
  },
  {
    id: "asset-004",
    propertyName: "Mindspace REIT — Commerzone",
    schemeName: "Fractio Mindspace SPV IV",
    city: "Hyderabad",
    unitsHeld: 60,
    avgBuyPrice: 9_800,
    currentPrice: 10_640,
    fiveYrIRR: 12.1,
    plPct: 8.57,
    concentrationPct: 5.0,
    totalUnitsInFloat: 1200,
  },
  {
    id: "asset-005",
    propertyName: "Phoenix Mills — Lower Parel",
    schemeName: "Fractio Phoenix SPV V",
    city: "Mumbai",
    unitsHeld: 40,
    avgBuyPrice: 18_500,
    currentPrice: 19_220,
    fiveYrIRR: 8.9,
    plPct: 3.89,
    concentrationPct: 3.33,
    totalUnitsInFloat: 1200,
  },
];

// ---------------------------------------------------------------------------
// Marketplace Properties
// ---------------------------------------------------------------------------

export const marketplaceProperties: MarketplaceProperty[] = [
  {
    id: "mkt-001",
    schemeName: "Fractio Brigade SPV VI",
    propertyName: "Brigade Gateway — World Trade Center",
    city: "Bangalore",
    state: "Karnataka",
    cityTier: "tier_1",
    totalValueCr: 185,
    totalValue: 185_00_00_000,
    projectedIRR: 10.5,
    dividendYield: 8.8,
    baseRentalYieldPct: 9.0,
    minInvestment: 10_00_000,
    pricePerUnit: 11_250,
    totalUnits: 16444,
    publicFloatUnits: 12000,
    occupancyPct: 94,
    waleYears: 6.2,
    assetGrade: "Grade A+",
    carpetAreaSqft: 120000,
    rbiRepoRatePct: 6.25,
    expectedRentalEscalationPct: 5.0,
    terminalCapRatePct: 8.0,
    imageUrl: "",
  },
  {
    id: "mkt-002",
    schemeName: "Fractio Godrej SPV VII",
    propertyName: "Godrej BKC — Bandra Kurla Complex",
    city: "Mumbai",
    state: "Maharashtra",
    cityTier: "tier_1",
    totalValueCr: 420,
    totalValue: 420_00_00_000,
    projectedIRR: 9.2,
    dividendYield: 7.5,
    baseRentalYieldPct: 8.0,
    minInvestment: 10_00_000,
    pricePerUnit: 15_800,
    totalUnits: 26582,
    publicFloatUnits: 20000,
    occupancyPct: 97,
    waleYears: 7.8,
    assetGrade: "Grade A+",
    carpetAreaSqft: 180000,
    rbiRepoRatePct: 6.25,
    expectedRentalEscalationPct: 5.0,
    terminalCapRatePct: 8.0,
    imageUrl: "",
  },
  {
    id: "mkt-003",
    schemeName: "Fractio RMZ SPV VIII",
    propertyName: "RMZ Ecoworld — Outer Ring Road",
    city: "Bangalore",
    state: "Karnataka",
    cityTier: "tier_1",
    totalValueCr: 128,
    totalValue: 128_00_00_000,
    projectedIRR: 11.8,
    dividendYield: 9.2,
    baseRentalYieldPct: 9.7,
    minInvestment: 10_00_000,
    pricePerUnit: 9_500,
    totalUnits: 13473,
    publicFloatUnits: 10000,
    occupancyPct: 91,
    waleYears: 5.1,
    assetGrade: "Grade A",
    carpetAreaSqft: 100000,
    rbiRepoRatePct: 6.25,
    expectedRentalEscalationPct: 5.0,
    terminalCapRatePct: 8.0,
    imageUrl: "",
  },
  {
    id: "mkt-004",
    schemeName: "Fractio Salarpuria SPV IX",
    propertyName: "Salarpuria Sattva — Knowledge City",
    city: "Hyderabad",
    state: "Telangana",
    cityTier: "tier_2",
    totalValueCr: 95,
    totalValue: 95_00_00_000,
    projectedIRR: 12.4,
    dividendYield: 9.8,
    baseRentalYieldPct: 10.2,
    minInvestment: 10_00_000,
    pricePerUnit: 8_200,
    totalUnits: 11585,
    publicFloatUnits: 9000,
    occupancyPct: 88,
    waleYears: 4.5,
    assetGrade: "Grade A",
    carpetAreaSqft: 95000,
    rbiRepoRatePct: 6.25,
    expectedRentalEscalationPct: 5.0,
    terminalCapRatePct: 8.0,
    imageUrl: "",
  },
  {
    id: "mkt-005",
    schemeName: "Fractio Brookfield SPV X",
    propertyName: "Brookfield Equinox — Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    cityTier: "tier_1",
    totalValueCr: 310,
    totalValue: 310_00_00_000,
    projectedIRR: 9.8,
    dividendYield: 8.1,
    baseRentalYieldPct: 9.1,
    minInvestment: 10_00_000,
    pricePerUnit: 13_400,
    totalUnits: 23134,
    publicFloatUnits: 18000,
    occupancyPct: 95,
    waleYears: 6.8,
    assetGrade: "Grade A+",
    carpetAreaSqft: 150000,
    rbiRepoRatePct: 6.25,
    expectedRentalEscalationPct: 5.0,
    terminalCapRatePct: 8.0,
    imageUrl: "",
  },
  {
    id: "mkt-006",
    schemeName: "Fractio L&T SPV XI",
    propertyName: "L&T Techpark — Navi Mumbai",
    city: "Navi Mumbai",
    state: "Maharashtra",
    cityTier: "tier_2",
    totalValueCr: 72,
    totalValue: 72_00_00_000,
    projectedIRR: 13.1,
    dividendYield: 10.2,
    baseRentalYieldPct: 10.5,
    minInvestment: 10_00_000,
    pricePerUnit: 7_800,
    totalUnits: 9230,
    publicFloatUnits: 7500,
    occupancyPct: 86,
    waleYears: 3.9,
    assetGrade: "Grade B+",
    carpetAreaSqft: 86000,
    rbiRepoRatePct: 6.25,
    expectedRentalEscalationPct: 5.0,
    terminalCapRatePct: 8.5,
    imageUrl: "",
  },
];
