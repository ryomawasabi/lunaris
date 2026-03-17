export function AsSeenIn() {
  const publications = [
    "MindBodyGreen",
    "Goop",
    "Well+Good",
    "Spirituality & Health",
    "The Chalkboard Mag"
  ];

  return (
    <section className="py-16 md:py-20 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-center font-sans text-sm uppercase tracking-widest text-warm mb-8">
          Trusted by Spiritual Communities
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {publications.map((publication) => (
            <div
              key={publication}
              className="text-stone/60 font-sans text-sm md:text-base uppercase tracking-wider hover:text-stone transition-colors"
            >
              {publication}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
