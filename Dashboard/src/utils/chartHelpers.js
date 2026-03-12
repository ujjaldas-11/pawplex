export const weekDays = () => {
  const days = [];
  const date = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(date);
    d.setDate(date.getDate() - i);
    days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
  }
  return days;
};

export const months = () => {
  const m = [];
  const date = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(date);
    d.setMonth(date.getMonth() - i);
    m.push(d.toLocaleDateString('en-US', { month: 'short' }));
  }
  return m;
};
