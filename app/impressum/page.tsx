import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Legal notice" };

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-10 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Legal notice</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Provider information</h2>
            <p>
              [Approved legal entity name]<br />
              [Street address]<br />
              [Postcode and city]<br />
              [Country]
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Contact</h2>
            <p>
              Email: [add approved CYREX contact address]
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Responsible content contact</h2>
            <p>
              [Approved contact name]<br />
              [Address as above]
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Disclaimer</h2>
            <p className="text-sm leading-relaxed">
              This template must be reviewed and approved for the relevant jurisdiction. Do not rely on it as legal advice or as a complete legal notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Dispute resolution</h2>
            <p className="text-sm leading-relaxed">
              Add approved dispute-resolution information for the applicable jurisdiction here, if required.
            </p>
          </section>
        </div>

        <p className="mt-10 text-xs text-gray-400 dark:text-gray-500">
          Replace all bracketed placeholders with approved legal information before publishing.
        </p>
      </div>
    </div>
  );
}
