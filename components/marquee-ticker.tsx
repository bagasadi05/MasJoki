export function MarqueeTicker() {
  const items = [
    "Harga kelihatan di awal",
    "Revisi 2× gratis",
    "Mulai dari 6 jam",
    "File Word & PPT diserahkan",
    "ShopeePay · GoPay · DANA",
    "Natural & rapi",
    "Rahasia & privat",
    "Chat WhatsApp tanpa akun",
  ];

  return (
    <div className="relative overflow-hidden border-y border-line bg-paper-2/80 py-3 select-none">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5">
        {items.map((text) => (
          <div key={text} className="flex items-center gap-2 font-display text-xs font-semibold text-ink-soft">
            <span aria-hidden className="size-1.5 rounded-full bg-brand/40" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
