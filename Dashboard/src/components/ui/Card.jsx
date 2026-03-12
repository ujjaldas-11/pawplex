export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 ${className}`}>
      {children}
    </div>
  );
};
