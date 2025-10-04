export function getSortedMembers(members, sortField, sortOrder) {
  return [...members].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === "name") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (sortField === "birthday") {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
}
