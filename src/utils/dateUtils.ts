export const dateUtils = {
  getMonday: (date: Date): string => {
    const copyDate = new Date(date);
    copyDate.setHours(12);

    const day = copyDate.getDay();
    const diff = copyDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(copyDate.setDate(diff));
    return monday.toISOString().split('T')[0];
  },
  getSunday: (date: Date): string => {
    const copyDate = new Date(date);
    copyDate.setHours(12);

    const day = copyDate.getDay();
    const diff = copyDate.getDate() - day + (day === 0 ? 0 : 7);
    const sunday = new Date(copyDate.setDate(diff));
    return sunday.toISOString().split('T')[0];
  },
};
