export function MarqueeTicker() {
  const items = [
    { text: "Harga kelihatan di awal", ikon: "🏷️" },
    { text: "Revisi 2× gratis", ikon: "🔄" },
    { text: "Mulai dari 6 jam", ikon: "⚡" },
    { text: "File Word & PPT diserahkan", ikon: "📁" },
    { text: "ShopeePay · GoPay · DANA", ikon: "💳" },
    { text: "Natural & rapi", ikon: "✍️" },
    { text: "Rahasia & privat", ikon: "🛡️" },
    { text: "Chat WhatsApp tanpa akun", ikon: "💬" },
  ];

  return (
    <div className="relative overflow-hidden border-y border-line bg-paper-2/80 py-3 select-none">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5">
        {items.map((item, index) => (
          <div
            key={`${item.text}-${index}`}
            className="flex items-center gap-2 font-display text-xs font-semibold text-ink-soft"
          >
            <span className="text-sm">{item.ikon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}