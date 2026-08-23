export function SimpleHero({
  title,
  subtitle,
  scheme = "scheme-1",
}: {
  title: string;
  subtitle?: string;
  scheme?: string;
}) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme} btn-dark badge-alt alternate logo-alt`}>
      <div className="container max-w-lg text-center">
        <h1 className="mb-5 text-h1 font-bold text-white md:mb-6">{title}</h1>
        {subtitle && <p className="text-medium text-white">{subtitle}</p>}
      </div>
    </section>
  );
}
