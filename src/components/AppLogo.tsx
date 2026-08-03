import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  textClassName = ''
}) => {
  const dimensionMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const imgSizeClass = dimensionMap[size] || dimensionMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex items-center justify-center shrink-0 ${imgSizeClass} rounded-2xl bg-white p-1 shadow-sm border border-slate-200/80 dark:border-slate-700/80 overflow-hidden group`}>
        <img 
          src="/logo.svg" 
          alt="Shala Sahayak App Logo" 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
        />
      </div>

      {showText && (
        <div className={`flex flex-col ${textClassName}`}>
          <span className="font-black text-sm sm:text-base tracking-tight leading-none text-blue-700 dark:text-blue-400">
            SHALA SAHAYAK
          </span>
          <span className="font-extrabold text-[9px] sm:text-[10px] tracking-widest leading-tight text-emerald-600 dark:text-emerald-400 uppercase mt-0.5">
            SCHOOL ASSISTANT
          </span>
        </div>
      )}
    </div>
  );
};
