import React from 'react';

interface GlobalLoaderProps {
  message?: string;
}

export default function GlobalLoader({ message }: GlobalLoaderProps) {
  return (
    <div className="fixed inset-0 bg-surface z-[100] flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-6 h-6 bg-primary rounded-full animate-pulse"></span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 animate-pulse">
            <img src="/icon.png" alt="i-help logo" className="w-8 h-8 object-contain" />
            <h1 className="text-primary font-bold text-headline-sm">i-help</h1>
          </div>
          {message && (
            <p className="text-on-surface-variant text-body-sm animate-pulse">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
