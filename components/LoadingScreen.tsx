"use client";

import { RefreshCw } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50">
      <div className="mb-4 animate-spin text-blue-500">
        <RefreshCw className="h-16 w-16" />
      </div>
      <h2 className="animate-pulse text-2xl font-bold text-slate-700">
        Making game...
      </h2>
    </div>
  );
}
