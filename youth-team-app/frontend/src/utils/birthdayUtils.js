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
