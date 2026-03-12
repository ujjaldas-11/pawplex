import { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1 font-medium">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full border rounded-lg px-3 py-2 outline-none transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700'
        }`}
        {...props}
      />
      {error && (
        <span className="block mt-1 text-red-500 text-xs">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
