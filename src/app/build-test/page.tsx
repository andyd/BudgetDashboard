/**
 * Build Test Page
 * Purpose: Identify which component is causing the useRef build error
 * Incrementally uncomment imports to find the problematic component
 */

export default function BuildTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Build Test Page</h1>
      <p className="text-muted-foreground">
        This page exists to test component imports incrementally.
      </p>

      {/* Step 1: Empty page - should build successfully */}
      <div className="mt-8 p-4 border rounded-lg">
        <p>Step 1: Empty page loaded successfully ✓</p>
      </div>
    </div>
  );
}
