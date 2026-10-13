// Megapolis layout extracted from the numbered EXPOJOYERIA PDF.
// Positions and rotations are shared with the 3D model. Every stand is 3 × 3 m.
export const boothAvailabilityValues = ["available", "occupied", "unconfirmed"] as const;
export type BoothAvailability = (typeof boothAvailabilityValues)[number];
export type BoothLayoutItem = {
  code: string; x: number; y: number; width: number; height: number;
  rotation: number; defaultStatus: BoothAvailability;
};
export type BoothStatusView = { code: string; status: BoothAvailability; updated_at: string | null };
export const boothLayout: BoothLayoutItem[] = [
  {
    "code": "1",
    "x": 71.478549,
    "y": 31.679433,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "2",
    "x": 69.275453,
    "y": 31.679433,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "3",
    "x": 67.021244,
    "y": 31.679433,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "4",
    "x": 60.433109,
    "y": 31.783156,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "5",
    "x": 58.23,
    "y": 31.783156,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "6",
    "x": 55.975803,
    "y": 31.783156,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "7",
    "x": 50.273238,
    "y": 31.783156,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "8",
    "x": 48.070155,
    "y": 31.783156,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "9",
    "x": 45.815933,
    "y": 31.783156,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "10",
    "x": 40.948575,
    "y": 31.783156,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "11",
    "x": 38.745492,
    "y": 31.783156,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "12",
    "x": 34.833387,
    "y": 30.677449,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 42.867054,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "13",
    "x": 32.167161,
    "y": 26.938266,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "14",
    "x": 30.492832,
    "y": 24.978337,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "15",
    "x": 28.77965,
    "y": 22.972929,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "16",
    "x": 25.745311,
    "y": 19.030543,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "17",
    "x": 24.070982,
    "y": 17.070613,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "18",
    "x": 22.357801,
    "y": 15.065206,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "19",
    "x": 20.14808,
    "y": 18.951372,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "20",
    "x": 21.861264,
    "y": 20.956787,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "21",
    "x": 23.535591,
    "y": 22.916716,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "22",
    "x": 26.553466,
    "y": 26.884064,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "23",
    "x": 28.266648,
    "y": 28.889472,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "24",
    "x": 29.940977,
    "y": 30.849404,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "25",
    "x": 31.917867,
    "y": 34.716131,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 42.867054,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "26",
    "x": 33.532592,
    "y": 36.767621,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 42.867054,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "27",
    "x": 36.858187,
    "y": 37.245567,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "28",
    "x": 39.112383,
    "y": 37.245567,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "29",
    "x": 41.315492,
    "y": 37.245567,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "30",
    "x": 45.790389,
    "y": 37.958936,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "31",
    "x": 48.044585,
    "y": 37.958936,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "32",
    "x": 50.247694,
    "y": 37.958936,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "33",
    "x": 55.950233,
    "y": 37.958936,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "34",
    "x": 58.204443,
    "y": 37.958936,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "35",
    "x": 60.407539,
    "y": 37.958936,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "36",
    "x": 66.995674,
    "y": 37.855213,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "37",
    "x": 69.249896,
    "y": 37.855213,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "38",
    "x": 71.452979,
    "y": 37.855213,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "39",
    "x": 71.478549,
    "y": 40.87078,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "40",
    "x": 69.275453,
    "y": 40.87078,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "41",
    "x": 67.021244,
    "y": 40.87078,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "42",
    "x": 60.433109,
    "y": 40.974539,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "43",
    "x": 58.23,
    "y": 40.974539,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "44",
    "x": 55.975803,
    "y": 40.974539,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "45",
    "x": 50.273238,
    "y": 40.974539,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "46",
    "x": 48.070155,
    "y": 40.974539,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "47",
    "x": 45.815933,
    "y": 40.974539,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "48",
    "x": 41.341036,
    "y": 40.261135,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "49",
    "x": 39.137953,
    "y": 40.261135,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "50",
    "x": 36.883731,
    "y": 40.261135,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "51",
    "x": 28.528536,
    "y": 33.163954,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "52",
    "x": 26.85421,
    "y": 31.204021,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "53",
    "x": 25.141026,
    "y": 29.19861,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "54",
    "x": 22.113404,
    "y": 25.219855,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "55",
    "x": 20.448824,
    "y": 23.271337,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "56",
    "x": 18.735642,
    "y": 21.265929,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "57",
    "x": 15.936256,
    "y": 25.397213,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "58",
    "x": 17.649438,
    "y": 27.402621,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "59",
    "x": 19.323767,
    "y": 29.36255,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "60",
    "x": 22.499005,
    "y": 33.079411,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "61",
    "x": 24.212189,
    "y": 35.084823,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "62",
    "x": 25.886518,
    "y": 37.044755,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "63",
    "x": 29.323333,
    "y": 40.758677,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 42.867054,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "64",
    "x": 30.975532,
    "y": 42.857784,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 42.867054,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "65",
    "x": 32.590256,
    "y": 44.909273,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 42.866596,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "66",
    "x": 36.516839,
    "y": 46.839113,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "67",
    "x": 38.771062,
    "y": 46.839113,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "68",
    "x": 40.974145,
    "y": 46.839113,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "69",
    "x": 45.815933,
    "y": 46.942837,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "70",
    "x": 48.070155,
    "y": 46.942837,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "71",
    "x": 50.273238,
    "y": 46.942837,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "72",
    "x": 55.975803,
    "y": 46.942837,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "73",
    "x": 58.23,
    "y": 46.942837,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "74",
    "x": 60.433109,
    "y": 46.942837,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "75",
    "x": 67.021244,
    "y": 46.839113,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "76",
    "x": 69.275453,
    "y": 46.839113,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "77",
    "x": 71.478549,
    "y": 46.839113,
    "width": 2.203083,
    "height": 3.015567,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  }
];
const boothCodeSet = new Set(boothLayout.map((item) => item.code));
if (boothCodeSet.size !== 77 || boothLayout.length !== 77) {
  throw new Error("Megapolis layout must contain exactly 77 unique booths.");
}
export function isBoothAvailability(value: string): value is BoothAvailability {
  return boothAvailabilityValues.includes(value as BoothAvailability);
}
export function normalizeBoothCode(value: string): string {
  const trimmed = value.trim();
  return /^\d{1,3}$/.test(trimmed) ? String(Number(trimmed)) : trimmed;
}
export function isValidBoothCode(value: string): boolean {
  return boothCodeSet.has(normalizeBoothCode(value));
}
export function getDefaultBoothStatuses(): BoothStatusView[] {
  return boothLayout.map((item) => ({ code: item.code, status: item.defaultStatus, updated_at: null }));
}
