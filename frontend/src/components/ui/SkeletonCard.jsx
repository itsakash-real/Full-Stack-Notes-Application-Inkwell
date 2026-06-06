import { memo } from "react";

const SkeletonCard = () => (
  <div className="bg-surface border border-border rounded-2xl p-5 space-y-3.5 animate-pulse">
    <div className="h-4 bg-hover rounded-md w-2/3" />
    <div className="space-y-2">
      <div className="h-3 bg-hover rounded-md w-full" />
      <div className="h-3 bg-hover rounded-md w-5/6" />
      <div className="h-3 bg-hover rounded-md w-3/4" />
    </div>
    <div className="flex gap-1.5 pt-2">
      <div className="h-5 w-14 bg-hover rounded-md" />
      <div className="h-5 w-10 bg-hover rounded-md" />
    </div>
  </div>
);

export default memo(SkeletonCard);
