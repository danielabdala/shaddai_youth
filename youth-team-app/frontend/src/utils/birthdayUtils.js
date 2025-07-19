export function getUpcomingBirthdays(members, daysAhead = 30) {
  const today = new Date();
  const upcoming = [];

  members.forEach((member) => {
    const birthday = new Date(member.birthday);

    // Normalize the year to this year so we can calculate upcoming dates
    birthday.setFullYear(today.getFullYear());

    // Calculate days difference from today
    const diff = birthday - today;
    const daysDiff = diff / (1000 * 60 * 60 * 24);

    // Only include birthdays within the desired range
    if (daysDiff >= 0 && daysDiff <= daysAhead) {
      upcoming.push({
        ...member,
        upcomingDate: birthday, // used for accurate sorting and display
      });
    }
  });

  // Sort the list based on the normalized upcoming birthday date
  return upcoming.sort((a, b) => a.upcomingDate - b.upcomingDate);
}
