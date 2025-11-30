// lib/getJalaliMonths.ts
import moment from "moment-jalaali";

export function getLast12JalaliMonths() {
  const months = [];

  for (let i = 11; i >= 0; i--) {
    const m = moment().subtract(i, "jMonth");
    months.push({
      key: m.format("jYYYY-jMM"),
      label: m.format("jMMMM"),
      start: m.startOf("jMonth").toDate(),
      end: m.endOf("jMonth").toDate(),
    });
  }

  return months;
}
