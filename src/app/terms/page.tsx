import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for the Federal Budget Dashboard, including usage policies, data disclaimers, and attribution requirements.",
  openGraph: {
    title: "Terms of Service - Federal Budget Dashboard",
    description:
      "Usage terms, data accuracy disclaimers, and attribution requirements for the Federal Budget Dashboard.",
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: January 30, 2026</p>
      </div>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        {/* Acceptance */}
        <section>
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using the Federal Budget Dashboard (&quot;the
            Service&quot;), you agree to be bound by these Terms of Service. If
            you do not agree to these terms, please do not use the Service. We
            reserve the right to modify these terms at any time, and your
            continued use of the Service constitutes acceptance of any changes.
          </p>
        </section>

        {/* Description of Service */}
        <section>
          <h2 className="text-2xl font-semibold">2. Description of Service</h2>
          <p className="text-muted-foreground">
            The Federal Budget Dashboard is a free, publicly accessible data
            visualization tool that presents information about U.S. federal
            spending. The Service aggregates publicly available government data
            and presents it through interactive visualizations and comparative
            analyses for educational and informational purposes.
          </p>
        </section>

        {/* Data Accuracy Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold">
            3. Data Accuracy Disclaimer
          </h2>
          <p className="text-muted-foreground">
            While we strive to provide accurate and up-to-date information, the
            Service is provided &quot;as is&quot; without warranties of any
            kind, either express or implied. Specifically:
          </p>
          <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-6">
            <li>
              Data is sourced from official government databases (primarily
              USAspending.gov) and is subject to the accuracy and timeliness of
              those sources.
            </li>
            <li>
              Budget figures may reflect budget authority, obligations, or
              outlays depending on context. These represent different stages of
              the spending process and are not interchangeable.
            </li>
            <li>
              Comparisons and calculations are illustrative and intended to make
              large numbers comprehensible. They do not constitute financial,
              policy, or professional advice.
            </li>
            <li>
              There may be delays between government data updates and their
              reflection in the Service.
            </li>
            <li>
              Rounding, aggregation, and visualization choices may affect
              precision.
            </li>
          </ul>
          <p className="text-muted-foreground mt-4">
            We are not liable for any errors, omissions, or inaccuracies in the
            data presented, nor for any decisions made based on this
            information. Users requiring precise budget data for professional,
            legal, or policy purposes should consult primary government sources
            directly.
          </p>
        </section>

        {/* Use of Service */}
        <section>
          <h2 className="text-2xl font-semibold">4. Permitted Use</h2>
          <p className="text-muted-foreground">
            You may use the Service for personal, educational, journalistic, and
            non-commercial purposes. You agree not to:
          </p>
          <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-6">
            <li>
              Use automated systems to access the Service in a manner that
              exceeds reasonable request volumes or degrades service for others.
            </li>
            <li>Misrepresent the source or nature of the data presented.</li>
            <li>
              Use the Service to spread misinformation or manipulate public
              understanding of government spending.
            </li>
            <li>
              Attempt to gain unauthorized access to the Service&apos;s systems
              or data.
            </li>
            <li>
              Remove or obscure attribution when sharing content from the
              Service.
            </li>
          </ul>
        </section>

        {/* Attribution Requirements */}
        <section>
          <h2 className="text-2xl font-semibold">
            5. Attribution Requirements
          </h2>
          <p className="text-muted-foreground">
            When sharing visualizations, comparisons, or data from the Service,
            you must provide appropriate attribution:
          </p>
          <div className="bg-muted/50 mt-4 rounded-lg p-4">
            <p className="text-sm font-medium">Required attribution format:</p>
            <p className="text-muted-foreground mt-2 font-mono text-sm">
              Source: Federal Budget Dashboard (budgetdashboard.gov)
            </p>
          </div>
          <p className="text-muted-foreground mt-4">
            For social media and embedded content, a visible link to the Service
            or mention of &quot;Federal Budget Dashboard&quot; satisfies this
            requirement. When using screenshots or static images, include the
            attribution within the image or in the accompanying caption.
          </p>
          <p className="text-muted-foreground mt-4">
            You may not imply endorsement by the Service or any government
            agency when sharing this content.
          </p>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
          <p className="text-muted-foreground">
            The underlying federal budget data is public domain as U.S.
            government work. The Service&apos;s original visualizations, design,
            code, and comparative analyses are provided under an open-source
            license. You may use, modify, and redistribute these elements in
            accordance with the applicable license terms available in our source
            repository.
          </p>
        </section>

        {/* No Government Affiliation */}
        <section>
          <h2 className="text-2xl font-semibold">
            7. No Government Affiliation
          </h2>
          <p className="text-muted-foreground">
            The Federal Budget Dashboard is an independent project and is not
            affiliated with, endorsed by, or sponsored by any U.S. government
            agency, including the Department of the Treasury, Office of
            Management and Budget, or USAspending.gov. References to government
            data sources indicate the origin of the data, not an official
            relationship.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-semibold">8. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the fullest extent permitted by law, the Service and its
            operators shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the
            Service. This includes, without limitation, damages for loss of
            profits, data, or other intangible losses, even if we have been
            advised of the possibility of such damages.
          </p>
        </section>

        {/* Modifications */}
        <section>
          <h2 className="text-2xl font-semibold">9. Service Modifications</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify, suspend, or discontinue the Service
            at any time without notice. We are not liable for any modification,
            suspension, or discontinuation of the Service.
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-2xl font-semibold">10. Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms of Service shall be governed by and construed in
            accordance with the laws of the United States. Any disputes arising
            from these terms or your use of the Service shall be resolved in the
            appropriate courts of competent jurisdiction.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold">11. Contact</h2>
          <p className="text-muted-foreground">
            If you have questions about these Terms of Service, please contact
            us at{" "}
            <a
              href="mailto:legal@budgetdashboard.gov"
              className="text-primary hover:underline"
            >
              legal@budgetdashboard.gov
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
