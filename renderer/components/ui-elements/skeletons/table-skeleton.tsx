"use client";

import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  rows?: number;
  cols?: number;
};

export function TableSkeleton({ rows = 5, cols = 4 }: Props) {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-40" />

      <div className="border rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(cols)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {[...Array(rows)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4">
            {[...Array(cols)].map((_, j) => (
              <Skeleton key={j} className="h-5 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
