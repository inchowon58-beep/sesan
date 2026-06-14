const navItems = [
  { href: "#about", label: "소개" },
  { href: "#services", label: "보호 서비스" },
  { href: "#process", label: "파양 절차" },
  { href: "#shelter", label: "보호소 안내" },
  { href: "#faq", label: "문의" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sand/60 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <a href="#" className="group shrink-0">
          <span className="block font-serif text-base font-medium text-charcoal sm:text-lg">
            인천강아지파양
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-widest text-warm">
            Incheon Shelter Guide
          </span>
        </a>

        <nav aria-label="주요 메뉴" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-warm transition hover:text-charcoal"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="tel:0505-707-0401"
          className="shrink-0 rounded-full border border-sand px-4 py-2 text-xs font-medium text-charcoal transition hover:border-charcoal sm:text-sm"
        >
          0505-707-0401
        </a>
      </div>
    </header>
  );
}
