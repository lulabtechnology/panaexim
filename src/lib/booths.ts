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

const occupiedBooths = new Set([
  ...Array.from({ length: 17 }, (_, index) => `A${String(index + 1).padStart(2, "0")}`),
  "C07",
  "C08",
  "C09",
  "C10",
  "C11",
  "C12",
  "D01",
  "D02",
  "E23",
  "E25",
  "E26",
  "E27",
  "E28",
  "F01",
  "F03",
  "F04",
  "H07",
  "H10",
  "J01",
  "J02",
  "J03",
  "L01",
  "L02",
  "L03",
  "L04",
  "L05",
]);

function statusFor(code: string): BoothAvailability {
  return occupiedBooths.has(code) ? "occupied" : "available";
}

function verticalGroup(
  prefix: string,
  count: number,
  x: number,
  y: number,
  width: number,
  height: number,
  step: number,
): BoothLayoutItem[] {
  return Array.from({ length: count }, (_, index) => {
    const code = `${prefix}${String(index + 1).padStart(2, "0")}`;
    return {
      code,
      x,
      y: y + index * step,
      width,
      height,
      defaultStatus: statusFor(code),
    };
  });
}

function gridGroup(
  prefix: string,
  rows: number,
  columns: number,
  x: number,
  y: number,
  width: number,
  height: number,
  gapX: number,
  gapY: number,
): BoothLayoutItem[] {
  const booths: BoothLayoutItem[] = [];
  let current = 1;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const code = `${prefix}${String(current).padStart(2, "0")}`;
      booths.push({
        code,
        x: x + column * (width + gapX),
        y: y + row * (height + gapY),
        width,
        height,
        defaultStatus: statusFor(code),
      });
      current += 1;
    }
  }

  return booths;
}

const standardWidth = 5.85;
const standardHeight = 4.15;

export const boothLayout: BoothLayoutItem[] = [
  ...verticalGroup("A", 17, 2.2, 7.2, 5.7, 4.1, 4.42),
  ...gridGroup("B", 6, 2, 18.2, 15.1, standardWidth, standardHeight, 0.22, 0.22),
  ...gridGroup("C", 6, 2, 18.2, 46.2, standardWidth, standardHeight, 0.22, 0.22),
  {
    code: "D01",
    x: 18.2,
    y: 76.7,
    width: standardWidth,
    height: 8.8,
    defaultStatus: statusFor("D01"),
  },
  {
    code: "D02",
    x: 24.27,
    y: 76.7,
    width: standardWidth,
    height: 8.8,
    defaultStatus: statusFor("D02"),
  },
  ...gridGroup("E", 14, 2, 43.0, 10.7, standardWidth, 3.98, 0.22, 0.16),
  ...gridGroup("F", 2, 2, 43.0, 76.7, standardWidth, standardHeight, 0.22, 0.22),
  ...gridGroup("G", 6, 2, 66.8, 15.1, standardWidth, standardHeight, 0.22, 0.22),
  ...gridGroup("H", 6, 2, 66.8, 46.2, standardWidth, standardHeight, 0.22, 0.22),
  {
    code: "J01",
    x: 66.8,
    y: 76.7,
    width: standardWidth,
    height: standardHeight,
    defaultStatus: statusFor("J01"),
  },
  {
    code: "J02",
    x: 72.87,
    y: 76.7,
    width: standardWidth,
    height: standardHeight,
    defaultStatus: statusFor("J02"),
  },
  {
    code: "J03",
    x: 66.8,
    y: 81.08,
    width: 11.92,
    height: standardHeight,
    defaultStatus: statusFor("J03"),
  },
  ...verticalGroup("K", 17, 91.7, 7.2, 5.7, 4.1, 4.42),
  ...Array.from({ length: 5 }, (_, index) => {
    const code = `L${String(index + 1).padStart(2, "0")}`;
    return {
      code,
      x: 18.2 + index * 13.28,
      y: 92.0,
      width: 12.2,
      height: 4.65,
      defaultStatus: statusFor(code),
    };
  }),
];

const boothCodeSet = new Set(boothLayout.map((booth) => booth.code));

if (boothLayout.length !== 124) {
  throw new Error(`PanaEXIM booth layout must contain 124 booths, received ${boothLayout.length}.`);
}

export function isBoothAvailability(value: string): value is BoothAvailability {
  return boothAvailabilityValues.includes(value as BoothAvailability);
}

export function isValidBoothCode(value: string): boolean {
  return boothCodeSet.has(value.toUpperCase());
}

export function getDefaultBoothStatuses(): BoothStatusView[] {
  return boothLayout.map((booth) => ({
    code: booth.code,
    status: booth.defaultStatus,
    updated_at: null,
  }));
}
