// Minimal ambient declaration — lunar-javascript ships no types.
// The Bazi engine uses a small, stable subset (Solar.fromYmdHms, getLunar,
// getEightChar, setSect, getYear/Month/Day/Time, LunarUtil.WU_XING_*).
declare module 'lunar-javascript' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Solar: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Lunar: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const LunarUtil: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const SolarUtil: any;
}
