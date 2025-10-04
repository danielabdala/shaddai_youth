export function formatDateYYYYMMDD(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${month}/${day}/${year}`;
}

export function getUpcomingBirthdays(members, daysAhead = 30) {
  const today = new Date();
  const upcoming = [];

  members.forEach((member) => {
    const birthday = new Date(member.birthday);
    birthday.setFullYear(today.getFullYear());

    const diff = birthday - today;
    const daysDiff = diff / (1000 * 60 * 60 * 24);

    if (daysDiff >= 0 && daysDiff <= daysAhead) {
      upcoming.push({
        ...member,
        upcomingDate: birthday,
      });
    }
  });

  return upcoming.sort((a, b) => a.upcomingDate - b.upcomingDate);
}

// Get the quarter number for a given month (1–12)
export function getQuarter(month) {
  if (month >= 1 && month <= 3) return 1;
  if (month >= 4 && month <= 6) return 2;
  if (month >= 7 && month <= 9) return 3;
  if (month >= 10 && month <= 12) return 4;
  return null;
}

// Filter members by quarter (or return all)
export function filterByQuarter(members, quarter) {
  if (quarter === "all") return members;
  return members.filter((m) => {
    const month = parseInt(m.birthday.split("-")[1], 10);
    return getQuarter(month) === Number(quarter);
  });
}

// Detect current quarter based on today's date
export function getCurrentQuarter() {
  const now = new Date();
  return getQuarter(now.getMonth() + 1);
}
