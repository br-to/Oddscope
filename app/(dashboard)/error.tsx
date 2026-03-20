'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
        <h2 className="text-xl font-semibold text-red-800 mb-2">
          データの読み込みに失敗しました
        </h2>
        <p className="text-sm text-red-600 mb-4">
          ネットワーク接続を確認して、再試行ボタンを押してください
        </p>
        {error.message && (
          <p className="text-xs text-red-500 mb-4 font-mono">{error.message}</p>
        )}
        <Button onClick={reset} variant="destructive">
          再試行
        </Button>
      </div>
    </div>
  );
}
