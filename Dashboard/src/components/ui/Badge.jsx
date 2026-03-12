export const Badge = ({ children, color = 'teal', className = '' }) => {
  const colorClasses = color === 'teal'
    ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
    : color === 'yellow'
    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    : color === 'red'
    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    : color === 'slate'
    ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
    : '';

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colorClasses} ${className}`}>
      {children}
    </span>
  );
};
