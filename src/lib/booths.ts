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
    "x": 87.847542,
    "y": 54.410323,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "2",
    "x": 84.984259,
    "y": 54.410323,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "3",
    "x": 82.054545,
    "y": 54.410323,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "4",
    "x": 73.492189,
    "y": 54.599032,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "5",
    "x": 70.628889,
    "y": 54.599032,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "6",
    "x": 67.699192,
    "y": 54.599032,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "7",
    "x": 60.287778,
    "y": 54.599032,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "8",
    "x": 57.424512,
    "y": 54.599032,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "9",
    "x": 54.494781,
    "y": 54.599032,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "10",
    "x": 48.168855,
    "y": 54.599032,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "11",
    "x": 45.305589,
    "y": 54.599032,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "12",
    "x": 40.22117,
    "y": 52.587358,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 42.867054,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "13",
    "x": 36.755973,
    "y": 45.784458,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "14",
    "x": 34.579909,
    "y": 42.218652,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "15",
    "x": 32.35335,
    "y": 38.570103,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "16",
    "x": 28.409731,
    "y": 31.397503,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "17",
    "x": 26.233667,
    "y": 27.831697,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "18",
    "x": 24.007108,
    "y": 24.183148,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "19",
    "x": 21.135215,
    "y": 31.253465,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "20",
    "x": 23.361778,
    "y": 34.902026,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "21",
    "x": 25.537838,
    "y": 38.467832,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "22",
    "x": 29.460061,
    "y": 45.685845,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "23",
    "x": 31.68662,
    "y": 49.334394,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "24",
    "x": 33.862684,
    "y": 52.900206,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "25",
    "x": 36.431975,
    "y": 59.935155,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 42.867054,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "26",
    "x": 38.530574,
    "y": 63.667542,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 42.867054,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "27",
    "x": 42.852727,
    "y": 64.537097,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "28",
    "x": 45.782424,
    "y": 64.537097,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "29",
    "x": 48.645724,
    "y": 64.537097,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "30",
    "x": 54.461582,
    "y": 65.834968,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "31",
    "x": 57.391279,
    "y": 65.834968,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "32",
    "x": 60.254579,
    "y": 65.834968,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "33",
    "x": 67.66596,
    "y": 65.834968,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "34",
    "x": 70.595673,
    "y": 65.834968,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "35",
    "x": 73.458956,
    "y": 65.834968,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "36",
    "x": 82.021313,
    "y": 65.646258,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "37",
    "x": 84.951044,
    "y": 65.646258,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "38",
    "x": 87.81431,
    "y": 65.646258,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "39",
    "x": 87.847542,
    "y": 71.132645,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "40",
    "x": 84.984259,
    "y": 71.132645,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "41",
    "x": 82.054545,
    "y": 71.132645,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "42",
    "x": 73.492189,
    "y": 71.321419,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "43",
    "x": 70.628889,
    "y": 71.321419,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "44",
    "x": 67.699192,
    "y": 71.321419,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "45",
    "x": 60.287778,
    "y": 71.321419,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "46",
    "x": 57.424512,
    "y": 71.321419,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "47",
    "x": 54.494781,
    "y": 71.321419,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "48",
    "x": 48.678923,
    "y": 70.023484,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "49",
    "x": 45.815657,
    "y": 70.023484,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "50",
    "x": 42.885926,
    "y": 70.023484,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "51",
    "x": 32.026987,
    "y": 57.111194,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "52",
    "x": 29.850926,
    "y": 53.545381,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "53",
    "x": 27.624364,
    "y": 49.896826,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "54",
    "x": 23.689475,
    "y": 42.658058,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "55",
    "x": 21.526081,
    "y": 39.113013,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "56",
    "x": 19.299522,
    "y": 35.464465,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "57",
    "x": 15.661263,
    "y": 42.980735,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "58",
    "x": 17.887822,
    "y": 46.629284,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "59",
    "x": 20.063886,
    "y": 50.19509,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "60",
    "x": 24.190626,
    "y": 56.957381,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "61",
    "x": 26.417189,
    "y": 60.605935,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "62",
    "x": 28.593253,
    "y": 64.171748,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 40.536693,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "63",
    "x": 33.059955,
    "y": 70.92869,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 42.867054,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "64",
    "x": 35.207258,
    "y": 74.74771,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 42.867054,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "65",
    "x": 37.305855,
    "y": 78.480097,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 42.866596,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "66",
    "x": 42.409091,
    "y": 81.991161,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "67",
    "x": 45.338822,
    "y": 81.991161,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "68",
    "x": 48.202088,
    "y": 81.991161,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "69",
    "x": 54.494781,
    "y": 82.179871,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "70",
    "x": 57.424512,
    "y": 82.179871,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "71",
    "x": 60.287778,
    "y": 82.179871,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "72",
    "x": 67.699192,
    "y": 82.179871,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "73",
    "x": 70.628889,
    "y": 82.179871,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "74",
    "x": 73.492189,
    "y": 82.179871,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "75",
    "x": 82.054545,
    "y": 81.991161,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "76",
    "x": 84.984259,
    "y": 81.991161,
    "width": 2.863266,
    "height": 5.486387,
    "rotation": 0.0,
    "defaultStatus": "unconfirmed"
  },
  {
    "code": "77",
    "x": 87.847542,
    "y": 81.991161,
    "width": 2.863266,
    "height": 5.486387,
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
