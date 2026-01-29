import { YearOverYearIndicator } from "@/components/budget/YearOverYearIndicator";

export default function DemoYoYPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          YearOverYearIndicator Demo
        </h1>
        <p className="text-gray-600">
          Hover over each indicator to see the tooltip with dollar amounts.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Large Increase (+15%)</h2>
          <YearOverYearIndicator
            change={15.3}
            previousAmount={1000000000}
            currentAmount={1153000000}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Moderate Increase (+5.2%)</h2>
          <YearOverYearIndicator
            change={5.2}
            previousAmount={500000000}
            currentAmount={526000000}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Small Increase (+1.8%)</h2>
          <YearOverYearIndicator
            change={1.8}
            previousAmount={250000000}
            currentAmount={254500000}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Neutral (0.5% - Below 1%)</h2>
          <YearOverYearIndicator
            change={0.5}
            previousAmount={100000000}
            currentAmount={100500000}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Small Decrease (-2.1%)</h2>
          <YearOverYearIndicator
            change={-2.1}
            previousAmount={300000000}
            currentAmount={293700000}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            Moderate Decrease (-7.5%)
          </h2>
          <YearOverYearIndicator
            change={-7.5}
            previousAmount={800000000}
            currentAmount={740000000}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Large Decrease (-22.3%)</h2>
          <YearOverYearIndicator
            change={-22.3}
            previousAmount={2000000000}
            currentAmount={1554000000}
          />
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <div className="p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Usage Example (with previousAmount)
          </h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
            {`<YearOverYearIndicator
  change={5.2}
  previousAmount={500000000}
  currentAmount={526000000}
/>`}
          </pre>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Usage Example (auto-calculate previousAmount)
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            If previousAmount is not provided, it will be calculated from
            currentAmount and change.
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
            {`<YearOverYearIndicator
  change={5.2}
  currentAmount={526000000}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
