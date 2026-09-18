import React from 'react';

// Pulse skeleton card representing standard tool cards
export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs animate-pulse flex flex-col justify-between h-36">
    <div className="flex items-start justify-between">
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800" />
      <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800" />
    </div>
    <div className="space-y-2 mt-4">
      <div className="h-4 w-3/4 rounded-md bg-slate-100 dark:bg-slate-800" />
      <div className="h-3 w-5/6 rounded-md bg-slate-50 dark:bg-slate-800/60" />
    </div>
  </div>
);

// High-fidelity grid table skeleton for data-heavy views
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm animate-pulse space-y-4">
    {/* Table Header Filter controls */}
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
      <div className="h-4 w-40 rounded-md bg-slate-100 dark:bg-slate-800" />
      <div className="flex gap-2">
        <div className="h-8 w-24 rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="h-8 w-24 rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
    
    {/* Table Grid Columns */}
    <div className="space-y-2.5">
      <div className="grid grid-cols-12 gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="col-span-1 h-3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="col-span-4 h-3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="col-span-3 h-3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="col-span-2 h-3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="col-span-2 h-3 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 py-3.5 border-b border-slate-50 dark:border-slate-800/50 items-center">
          <div className="col-span-1 h-3 rounded bg-slate-100 dark:bg-slate-800/80 w-1/2" />
          <div className="col-span-4 space-y-1.5">
            <div className="h-3 rounded bg-slate-100 dark:bg-slate-800/80 w-3/4" />
            <div className="h-2 rounded bg-slate-50 dark:bg-slate-800/50 w-1/2" />
          </div>
          <div className="col-span-3 h-3 rounded bg-slate-100 dark:bg-slate-800/80 w-2/3" />
          <div className="col-span-2 h-3 rounded bg-slate-100 dark:bg-slate-800/80 w-2/3" />
          <div className="col-span-2 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/80 w-16" />
        </div>
      ))}
    </div>
  </div>
);

// Full Dashboard Skeleton Loading State
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse max-w-5xl mx-auto px-4 py-6">
    {/* Top Header Selector */}
    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl h-14">
      <div className="flex gap-2">
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="w-32 h-4 rounded bg-slate-100 dark:bg-slate-800" />
      <div className="w-20 h-6 rounded-lg bg-slate-100 dark:bg-slate-800" />
    </div>

    {/* Promo Banner Skeleton */}
    <div className="w-full h-24 rounded-3xl bg-slate-100 dark:bg-slate-800" />

    {/* Search Bar Skeleton */}
    <div className="w-full h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 flex items-center">
      <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 mr-3" />
      <div className="w-1/2 h-3 rounded bg-slate-100 dark:bg-slate-800" />
    </div>

    {/* Quick View / Pinned Section */}
    <div className="space-y-2">
      <div className="w-24 h-4 rounded bg-slate-100 dark:bg-slate-800" />
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    </div>

    {/* Card Grid Label */}
    <div className="flex justify-between items-center pt-2">
      <div className="w-32 h-4 rounded bg-slate-100 dark:bg-slate-800" />
      <div className="w-20 h-4 rounded bg-slate-100 dark:bg-slate-800" />
    </div>

    {/* Grid of reorderable Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);
