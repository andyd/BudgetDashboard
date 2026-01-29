import { SpotlightPanel } from '@/components/budget';

export default function SpotlightDemoPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">SpotlightPanel Demo</h1>
        <p className="text-muted-foreground">
          Editorial information cards explaining what budget items fund
        </p>
      </div>

      {/* F-35 Example - Default Open */}
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

      {/* Social Security Example */}
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

      {/* Medicare Example */}
      <SpotlightPanel
        budgetItemId="medicare-part-d"
        title="Medicare Part D Prescription Drug Benefit"
        description="Medicare Part D provides prescription drug coverage to 50+ million Medicare beneficiaries through private insurance plans. This budget funds federal subsidies to participating insurance companies, low-income subsidies for eligible beneficiaries, administration of the program through CMS, oversight and compliance monitoring, fighting fraud and abuse, and the catastrophic coverage reinsurance program. The Inflation Reduction Act (2022) added funding for price negotiation authority and capped out-of-pocket costs."
        sources={[
          {
            label: 'CMS Medicare Part D Overview',
            url: 'https://www.cms.gov/medicare/part-d',
          },
          {
            label: 'MedPAC Report on Part D',
            url: 'https://www.medpac.gov',
          },
        ]}
      />

      {/* Department of Energy Example */}
      <SpotlightPanel
        budgetItemId="doe-nuclear-security"
        title="National Nuclear Security Administration"
        description="The NNSA maintains and modernizes the U.S. nuclear weapons stockpile, operates national laboratories (Los Alamos, Lawrence Livermore, Sandia), conducts nuclear nonproliferation programs, and manages nuclear materials. This budget covers life extension programs for aging warheads, plutonium pit production capabilities, supercomputer systems for weapons simulation, nuclear material disposition, international nonproliferation initiatives, and emergency response to nuclear incidents."
        sources={[
          {
            label: 'NNSA Budget Overview',
            url: 'https://www.energy.gov/nnsa/budget',
          },
          {
            label: 'DOE Congressional Budget Request',
            url: 'https://www.energy.gov/budget',
          },
          {
            label: 'GAO: Nuclear Modernization',
            url: 'https://www.gao.gov/nuclear-modernization',
          },
        ]}
      />
    </div>
  );
}
