/**
 * Example usage of SpotlightPanel component
 * This file demonstrates how to use the SpotlightPanel for budget item explanations
 */

import { SpotlightPanel } from './SpotlightPanel';

export function SpotlightPanelExample() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      {/* F-35 Program Example */}
      <SpotlightPanel
        budgetItemId="f35-program"
        title="F-35 Lightning II Joint Strike Fighter"
        description="The F-35 is a family of single-seat, single-engine, all-weather stealth multirole combat aircraft intended to perform both air superiority and strike missions. Development began in 1992 with Lockheed Martin as the prime contractor. The program faced significant delays and cost overruns, with the total program cost estimated at over $1.7 trillion through 2070. Each aircraft costs approximately $80-110 million depending on the variant. The F-35 comes in three variants: F-35A (conventional takeoff and landing), F-35B (short takeoff and vertical landing), and F-35C (carrier-based). The program funds research, development, procurement of aircraft, pilot training, maintenance, and modernization efforts."
        sources={[
          {
            label: 'Department of Defense F-35 Program Overview',
            url: 'https://www.defense.gov/f35',
          },
          {
            label: 'GAO Report: F-35 Joint Strike Fighter',
            url: 'https://www.gao.gov/products/gao-23-106217',
          },
          {
            label: 'Congressional Research Service: F-35 Factsheet',
            url: 'https://crsreports.congress.gov',
          },
        ]}
        defaultOpen={true}
      />

      {/* Social Security Administration Example */}
      <SpotlightPanel
        budgetItemId="ssa-admin"
        title="Social Security Administration"
        description="The Social Security Administration manages the nation's social insurance programs, providing monthly benefits to approximately 67 million Americans. This budget covers administrative costs including staffing 60,000+ employees, processing benefit claims, maintaining field offices nationwide, operating the disability determination process, combating fraud, modernizing IT systems, and providing customer service through offices, phone centers, and online platforms. The administrative budget is separate from the benefit payments themselves (which come from Social Security trust funds)."
        sources={[
          {
            label: 'SSA FY2024 Budget Overview',
            url: 'https://www.ssa.gov/budget',
          },
          {
            label: 'SSA Annual Performance Report',
            url: 'https://www.ssa.gov/agency/performance',
          },
        ]}
      />

      {/* NASA Example */}
      <SpotlightPanel
        budgetItemId="nasa-science"
        title="NASA Science Missions"
        description="NASA's Science Mission Directorate funds planetary science, astrophysics, Earth science, and heliophysics research. This includes operating space telescopes like James Webb and Hubble, planetary missions to Mars and beyond, Earth observation satellites monitoring climate and weather, research grants to universities and institutions, mission operations and data analysis, and technology development for future missions. Recent missions include the Perseverance Mars rover, DART asteroid impact mission, and the upcoming Europa Clipper."
        sources={[
          {
            label: 'NASA Science Budget Request',
            url: 'https://science.nasa.gov/budget',
          },
          {
            label: 'NASA Strategic Plan',
            url: 'https://www.nasa.gov/stratplan',
          },
        ]}
      />
    </div>
  );
}
