export const Table = ({ children }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  );
};

export const Thead = ({ children }) => (
  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm uppercase tracking-wide">
    {children}
  </thead>
);

export const Tbody = ({ children }) => (
  <tbody>
    {children}
  </tbody>
);

export const Tr = ({ children, className = '' }) => (
  <tr className={`border-b border-slate-100 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-slate-800/50 transition-colors duration-100 ${className}`}>
    {children}
  </tr>
);

export const Th = ({ children, className = '' }) => (
  <th className={`px-4 py-3 font-medium ${className}`}>
    {children}
  </th>
);

export const Td = ({ children, className = '' }) => (
  <td className={`px-4 py-3 text-slate-700 dark:text-slate-300 ${className}`}>
    {children}
  </td>
);
