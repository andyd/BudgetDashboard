import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 text-center">
            <Skeleton className="mx-auto mb-2 h-10 w-80 sm:w-96" />
            <Skeleton className="mx-auto h-5 w-64" />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Main Comparison Module - 8 cols */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900 sm:p-8">
                {/* Result Display */}
                <div className="mb-8 text-center">
                  <Skeleton className="mx-auto mb-1 h-4 w-32" />
                  <Skeleton className="mx-auto mb-4 h-6 w-48" />
                  <Skeleton className="mx-auto mb-4 h-16 w-40" />
                  <Skeleton className="mx-auto h-8 w-56" />
                  <Skeleton className="mx-auto mt-2 h-4 w-24" />
                </div>

                {/* Selectors */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Skeleton className="mb-2 h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div>
                    <Skeleton className="mb-2 h-4 w-20" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-9 w-28 rounded-md" />
                  <Skeleton className="h-9 w-28 rounded-md" />
                </div>
              </div>

              {/* Data Source */}
              <div className="mt-4 flex justify-center">
                <Skeleton className="h-5 w-48" />
              </div>
            </div>

            {/* Sidebar - 4 cols */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800/50">
                <Skeleton className="mb-4 h-4 w-32" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-white p-3 dark:bg-slate-900"
                    >
                      <Skeleton className="mb-1 h-3 w-24" />
                      <Skeleton className="mb-1 h-5 w-full" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
                <Skeleton className="mx-auto mt-4 h-5 w-40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Overview */}
      <section className="border-t bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <Skeleton className="mx-auto mb-8 h-8 w-56" />
          <div className="mx-auto max-w-3xl">
            {/* Pie Chart Skeleton */}
            <div className="flex h-[400px] items-center justify-center">
              <div className="relative">
                <Skeleton className="h-64 w-64 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="h-32 w-32 rounded-full bg-white dark:bg-slate-900" />
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Skeleton className="mx-auto h-5 w-40" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="mx-auto h-12 w-24" />
                <Skeleton className="mx-auto mt-1 h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
