import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="space-y-3">
        <p className="text-sm text-gray-500 mb-6">市場データを読み込み中...</p>
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}
