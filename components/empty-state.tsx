export function EmptyState() {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-gray-500 mb-2">
        該当する市場が見つかりませんでした
      </h3>
      <p className="text-sm text-gray-400">
        フィルタ条件を変更するか、出来高の最小値を下げてみてください
      </p>
    </div>
  );
}
