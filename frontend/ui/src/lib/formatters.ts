const EUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const PCT = new Intl.NumberFormat("es-ES", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });
const NUM = new Intl.NumberFormat("es-ES");

export const formatEur = (v: number) => EUR.format(v);
export const formatPct = (v: number) => PCT.format(v);
export const formatNum = (v: number) => NUM.format(v);

/** Convierte años positivos → DAYS_BIRTH negativo */
export const yearsToDaysBirth = (years: number): number => Math.round(-years * 365.25);

/** Convierte DAYS_BIRTH negativo → años positivos */
export const daysBirthToYears = (days: number): number => Math.round(Math.abs(days) / 365.25);

/** Convierte años de empleo → DAYS_EMPLOYED (negativo) */
export const yearsToEmployedDays = (years: number): number =>
  years <= 0 ? 365243 : Math.round(-years * 365.25);

/** Convierte DAYS_EMPLOYED → años (si es 365243 = desempleado) */
export const employedDaysToYears = (days: number): number =>
  days === 365243 ? 0 : Math.round(Math.abs(days) / 365.25);
