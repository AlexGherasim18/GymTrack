export default function SkeletonLoading() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-10">
      <div className="animate-pulse rounded-full bg-gray-300 h-12 w-12 mb-4" />
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <span className="mt-4 text-gray-500">Loading...</span>
    </div>
  );
}