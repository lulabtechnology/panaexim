export const boothAvailabilityValues = ["available", "occupied"] as const;

export type BoothAvailability = (typeof boothAvailabilityValues)[number];

export type BoothLayoutItem = {
  code: string;
  x: number;
  y: number;
  width: number;
  height: number;
  defaultStatus: BoothAvailability;
};

export type BoothStatusView = {
  code: string;
  status: BoothAvailability;
  updated_at: string | null;
};

// Occupied booths inferred from the official numbered Canal 1 floor plan supplied by PanaEXIM.
// Exhibitor names are intentionally not stored here or exposed publicly.
const occupiedBooths = new Set([
  ...Array.from({ length: 17 }, (_, index) => String(index + 1)),
  ...Array.from({ length: 8 }, (_, index) => String(index + 27)),
  ...Array.from({ length: 6 }, (_, index) => String(index + 55)),
  "62",
  "63",
  "85",
  "87",
  "88",
  "89",
  "90",
  ...Array.from({ length: 5 }, (_, index) => String(index + 119)),
]);

function statusFor(code: string): BoothAvailability {
  return occupiedBooths.has(code) ? "occupied" : "available";
}

function booth(
  code: number,
  x: number,
  y: number,
  width: number,
  height: number,
): BoothLayoutItem {
  const normalized = String(code);
  return {
    code: normalized,
    x,
    y,
    width,
    height,
    defaultStatus: statusFor(normalized),
  };
}

function twoColumnBlock(
  leftCodes: number[],
  rightCodes: number[],
  x: number,
  y: number,
  width: number,
  height: number,
  gapX: number,
  stepY: number,
): BoothLayoutItem[] {
  return leftCodes.flatMap((leftCode, row) => [
    booth(leftCode, x, y + row * stepY, width, height),
    booth(rightCodes[row], x + width + gapX, y + row * stepY, width, height),
  ]);
}

const standardWidth = 5.85;
const standardHeight = 4.12;
const narrowGap = 0.18;
const rowStep = 4.34;

const physicalLayout: BoothLayoutItem[] = [
  // West wall: 17 at the top, 1 at the bottom.
  ...Array.from({ length: 17 }, (_, row) =>
    booth(17 - row, 1.65, 7.15 + row * 4.36, 5.95, 4.14),
  ),

  // West islands.
  ...twoColumnBlock(
    [18, 19, 20, 21, 22, 23],
    [43, 42, 41, 40, 39, 38],
    19.25,
    15.65,
    standardWidth,
    standardHeight,
    narrowGap,
    rowStep,
  ),
  ...twoColumnBlock(
    [24, 25, 26, 27, 28, 29],
    [37, 36, 35, 34, 33, 32],
    19.25,
    46.45,
    standardWidth,
    standardHeight,
    narrowGap,
    rowStep,
  ),
  booth(30, 19.25, 76.95, standardWidth, 8.48),
  booth(31, 25.28, 76.95, standardWidth, 8.48),

  // Central island: 44-57 on the left. On the right, booth 63 spans two
  // stacked modules exactly as shown in the numbered reference plan.
  ...Array.from({ length: 14 }, (_, row) =>
    booth(44 + row, 43.0, 10.95 + row * 4.12, standardWidth, 3.98),
  ),
  ...Array.from({ length: 11 }, (_, row) =>
    booth(74 - row, 49.03, 10.95 + row * 4.12, standardWidth, 3.98),
  ),
  booth(63, 49.03, 56.27, standardWidth, 8.10),
  booth(62, 49.03, 64.51, standardWidth, 3.98),
  ...twoColumnBlock(
    [58, 59],
    [61, 60],
    43.0,
    77.0,
    standardWidth,
    standardHeight,
    narrowGap,
    rowStep,
  ),

  // East islands.
  ...twoColumnBlock(
    [75, 76, 77, 78, 79, 80],
    [101, 100, 99, 98, 97, 96],
    66.65,
    15.65,
    standardWidth,
    standardHeight,
    narrowGap,
    rowStep,
  ),
  ...twoColumnBlock(
    [81, 82, 83, 84, 85, 86],
    [95, 94, 93, 92, 91, 90],
    66.65,
    46.45,
    standardWidth,
    standardHeight,
    narrowGap,
    rowStep,
  ),
  booth(87, 66.65, 76.95, standardWidth, standardHeight),
  booth(89, 72.68, 76.95, standardWidth, standardHeight),
  booth(88, 66.65, 81.29, standardWidth * 2 + narrowGap, standardHeight),

  // East wall: 102 at the top, 118 at the bottom.
  ...Array.from({ length: 17 }, (_, row) =>
    booth(102 + row, 90.55, 7.15 + row * 4.36, 5.95, 4.14),
  ),

  // South wall — present on the real floor plan and intentionally included.
  booth(119, 19.25, 94.2, 11.95, 4.4),
  booth(120, 31.38, 94.2, 11.95, 4.4),
  booth(121, 43.51, 94.2, 5.85, 4.4),
  booth(122, 49.54, 94.2, 5.85, 4.4),
  booth(123, 55.57, 94.2, 11.95, 4.4),
  booth(124, 67.70, 94.2, 5.85, 4.4),
  booth(125, 73.73, 94.2, 5.85, 4.4),
];

export const boothLayout: BoothLayoutItem[] = [...physicalLayout].sort(
  (a, b) => Number(a.code) - Number(b.code),
);

const boothCodeSet = new Set(boothLayout.map((item) => item.code));

if (boothLayout.length !== 125) {
  throw new Error(`PanaEXIM Canal 1 layout must contain 125 booths, received ${boothLayout.length}.`);
}

export function isBoothAvailability(value: string): value is BoothAvailability {
  return boothAvailabilityValues.includes(value as BoothAvailability);
}

export function normalizeBoothCode(value: string): string {
  const trimmed = value.trim();
  if (!/^\d{1,3}$/.test(trimmed)) return trimmed;
  return String(Number(trimmed));
}

export function isValidBoothCode(value: string): boolean {
  return boothCodeSet.has(normalizeBoothCode(value));
}

export function getDefaultBoothStatuses(): BoothStatusView[] {
  return boothLayout.map((item) => ({
    code: item.code,
    status: item.defaultStatus,
    updated_at: null,
  }));
}
