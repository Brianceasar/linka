"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is LINKA free to use?",
    a: "The Free plan includes one digital card, QR code, vCard download, and the features shown on the pricing page. Check the current plan details before choosing a subscription.",
  },
  {
    q: "Do visitors need an app?",
    a: "No. Your card is a web page and opens in a browser. Visitors do not need a LINKA app. NFC tags need to be written once with your card URL.",
  },
  {
    q: "How does NFC work?",
    a: "Write your public card URL to a compatible NFC tag. When someone taps a supported phone to the tag, the card opens in their browser.",
  },
  {
    q: "Can I use LINKA with my team?",
    a: "Yes. Eligible plans provide organisation management, roles, CSV import, and shared card design policies.",
  },
  {
    q: "What happens when my plan expires?",
    a: "Your account moves to the applicable available plan. Features that require a higher plan, such as white label or campaigns, are unavailable until you renew.",
  },
  {
    q: "How do I manage my subscription?",
    a: "Use the subscription management options available in your account, or contact your organisation administrator or service provider.",
  },
  {
    q: "How is data handled?",
    a: "Your deployment administrator is responsible for hosting, data processing, and privacy configuration. LINKA includes account and access controls designed to support secure operation.",
  },
  {
    q: "Can I use my own domain?",
    a: "Eligible plans support custom card domains. Configure DNS and your reverse proxy as described in the custom-domain guide.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100 pr-4">{faq.q}</span>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
