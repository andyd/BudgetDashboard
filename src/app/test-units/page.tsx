/**
 * Test page to verify Units API
 * Navigate to /test-units to see all comparison units
 */
'use client';

import { useEffect, useState } from 'react';
import type { ComparisonUnit } from '@/types/comparison';

export default function TestUnitsPage() {
  const [units, setUnits] = useState<ComparisonUnit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<ComparisonUnit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUnits() {
      try {
        setLoading(true);
        const response = await fetch('/api/units');

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setUnits(data);
        setFilteredUnits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch units');
      } finally {
        setLoading(false);
      }
    }

    fetchUnits();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredUnits(units);
    } else {
      const filtered = units.filter((unit) => unit.category === selectedCategory);
      setFilteredUnits(filtered);
    }
  }, [selectedCategory, units]);

  const categories = ['all', 'infrastructure', 'everyday', 'vehicles', 'buildings', 'misc'];

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000_000) {
      return `$${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(0)}M`;
    }
    if (amount >= 1_000) {
      return `$${(amount / 1_000).toFixed(0)}k`;
    }
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading comparison units...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-500 bg-red-50 p-6">
          <p className="text-lg font-semibold text-red-900">Error</p>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-bold">Comparison Units API Test</h1>
        <p className="mb-8 text-gray-600">
          Testing /api/units endpoint - {units.length} total units
        </p>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
              {category !== 'all' && ` (${units.filter((u) => u.category === category).length})`}
            </button>
          ))}
        </div>

        {/* Units grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    {unit.icon && <span className="text-2xl">{unit.icon}</span>}
                    <h3 className="text-lg font-semibold text-gray-900">{unit.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    {unit.nameSingular} • {unit.category}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(unit.costPerUnit)}
                </p>
                <p className="text-xs text-gray-500">per unit</p>
              </div>

              {unit.description && (
                <p className="text-sm text-gray-600">{unit.description}</p>
              )}
            </div>
          ))}
        </div>

        {filteredUnits.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-500">No units found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
