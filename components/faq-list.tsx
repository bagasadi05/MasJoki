import { faq } from "@/content/faq";

export function FaqList() {
  return (
    <div className="border-t border-line">
      {faq.map((item) => (
        <details
          key={item.q}
          className="group border-b border-line [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left transition-colors hover:text-brand">
            <span className="text-[0.95rem] font-medium leading-snug text-ink group-hover:text-brand">
              {item.q}
            </span>
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="mt-0.5 size-3.5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M8 2v12M2 8h12" />
            </svg>
          </summary>
          <p className="max-w-[68ch] pb-5 pr-10 text-[0.86rem] leading-relaxed text-ink-soft">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
