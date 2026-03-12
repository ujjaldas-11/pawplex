export const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseClass = 'animate-pulse bg-slate-200 dark:bg-slate-700';
  const variantClass = variant === 'card' 
    ? 'rounded-xl h-32 w-full' 
    : variant === 'avatar' 
    ? 'rounded-full h-10 w-10' 
    : 'rounded-md h-4 w-full';
    
  return (
    <div className={`${baseClass} ${variantClass} ${className}`} />
  );
};
