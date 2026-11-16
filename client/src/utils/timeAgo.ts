const DIVISIONS: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatTimeAgo(dateInput: string | number | Date): string {
  const timestamp =
    typeof dateInput === "string" || typeof dateInput === "number"
      ? new Date(dateInput).getTime()
      : dateInput.getTime();

  if (Number.isNaN(timestamp)) {
    return "";
  }

  let duration = (timestamp - Date.now()) / 1000;

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return "";
}

export const format = formatTimeAgo;
export default formatTimeAgo;
