import { Loader2 } from 'lucide-react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center transition-all duration-150 active:scale-95 rounded-lg font-medium outline-none disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = variant === 'primary' 
    ? 'bg-teal-600 hover:bg-teal-700 text-white' 
    : variant === 'secondary' 
    ? 'border border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200' 
    : variant === 'danger' 
    ? 'bg-red-500 hover:bg-red-600 text-white' 
    : variant === 'ghost' 
    ? 'hover:bg-teal-50 text-teal-700 dark:hover:bg-slate-800 dark:text-teal-400' 
    : '';

  const sizeClasses = size === 'sm' 
    ? 'px-3 py-1.5 text-sm' 
    : size === 'lg' 
    ? 'px-6 py-3 text-lg' 
    : 'px-4 py-2 text-base';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};
