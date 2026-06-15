import React from 'react';

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 bg-surface z-[100] flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-6 h-6 bg-primary rounded-full animate-pulse"></span>
          </div>
        </div>
        <h1 className="text-primary font-bold text-headline-sm animate-pulse">i-help</h1>
      </div>
    </div>
  );
}
