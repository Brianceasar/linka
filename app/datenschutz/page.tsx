import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Privacy" };

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-10 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="text-3xl font-bold mb-2">Privacy notice</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString("en", { year: "numeric", month: "long" })}</p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">1. Data controller</h2>
            <p>[Approved legal entity name and address]</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">2. Data collected</h2>
            <p>This template may include the following personal data:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Account data (name, email address, password hash)</li>
              <li>Digital card profile data (name, contact details, photo)</li>
              <li>Usage statistics (views, device type, source — without direct personal identification)</li>
              <li>Lead contact details that visitors choose to provide</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">3. Purpose of processing</h2>
            <p>Data is processed only to provide the LINKA service. Do not use this template as a substitute for approved legal advice.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">4. Storage location</h2>
            <p>State the approved hosting and data-storage locations here.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">5. Cookies</h2>
            <p>LINKA uses technically necessary session cookies for authentication. Describe any deployment-specific cookies here.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">6. Your rights</h2>
            <p>You may have rights of access, rectification, erasure, restriction, and portability under applicable law. Contact the approved CYREX privacy contact for details.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">7. Right to complain</h2>
            <p>You may have a right to complain to an applicable data-protection authority.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">8. Retention periods</h2>
            <p>Analytics retention depends on the plan. Document approved retention periods and account-deletion procedures here.</p>
          </section>
        </div>

        <p className="mt-10 text-xs text-gray-400 dark:text-gray-500">
          This privacy notice is a template and must be reviewed by qualified legal counsel for the applicable circumstances.
        </p>
      </div>
    </div>
  );
}
