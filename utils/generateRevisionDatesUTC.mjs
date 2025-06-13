function daysInMonthUTC(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function generateRevisionDatesUTC(startDate) {
  const intervals = [
    { type: "week", amount: 1 },
    { type: "month", amount: 1 },
    { type: "month", amount: 3 },
    { type: "month", amount: 6 },
    { type: "year", amount: 1 },
  ];
  const baseDate = new Date(startDate);
  const originalDay = baseDate.getUTCDate();

  return intervals.map(({ type, amount }) => {
    const revisionDate = new Date(
      Date.UTC(
        baseDate.getUTCFullYear(),
        baseDate.getUTCMonth(),
        baseDate.getUTCDate()
      )
    );
    if (type === "week") {
      revisionDate.setUTCDate(revisionDate.getUTCDate() + amount * 7);
    } else if (type === "month") {
      revisionDate.setUTCDate(1);
      revisionDate.setUTCMonth(revisionDate.getUTCMonth() + amount);
      revisionDate.setUTCDate(
        Math.min(
          originalDay,
          daysInMonthUTC(
            revisionDate.getUTCFullYear(),
            revisionDate.getUTCMonth()
          )
        )
      );
    } else if (type === "year") {
      revisionDate.setUTCDate(1);
      revisionDate.setUTCFullYear(revisionDate.getUTCFullYear() + amount);
      revisionDate.setUTCDate(
        Math.min(
          originalDay,
          daysInMonthUTC(
            revisionDate.getUTCFullYear(),
            revisionDate.getUTCMonth()
          )
        )
      );
    }
    return revisionDate.toISOString().split("T")[0];
  });
}
export { generateRevisionDatesUTC };
