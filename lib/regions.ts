import { z } from "zod";

export const REGIONS = ["은평구", "마포구", "서대문구", "동작구", "관악구", "안양시", "기타지역"] as const;

export type Region = (typeof REGIONS)[number];

export const regionSchema = z.enum(REGIONS, {
  errorMap: () => ({ message: "허용되지 않은 지역입니다." }),
});

export function isValidRegion(value: string): value is Region {
  return REGIONS.includes(value as Region);
}
