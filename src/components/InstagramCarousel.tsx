import { motion } from "motion/react";

const instagramPosters = [
  { id: 1, url: "/images/insta/Rebirth.webp" },
  { id: 2, url: "/images/insta/Ahinsa.webp" },
  { id: 3, url: "/images/insta/Digital-Skin.webp" },
  { id: 4, url: "/images/insta/antaryatra.webp" },
  { id: 5, url: "/images/insta/Ember.webp" },
  { id: 6, url: "/images/insta/krodh.webp" },
  { id: 7, url: "/images/insta/Greed.webp" },
  { id: 8, url: "/images/insta/Lo-Fi-Utopia.webp" },
];

export const InstagramCarousel = () => {
  // Duplicate the array to create a seamless loop
  const duplicatedPosters = [...instagramPosters, ...instagramPosters];

  return (
    <section className="py-20 bg-transparent overflow-hidden border-y border-black/5">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          className="flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-black/10" />
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-black/80">
            A glimpse into my visual world — experiments, ideas, and random creative drops.

          </h3>
          <div className="h-px flex-1 bg-black/10" />
        </motion.div>
      </div>

      <div className="relative flex">
        <motion.div
          animate={{
            x: [0, "-50%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-6 px-3"
        >
          {duplicatedPosters.map((poster, index) => (
            <div
              key={`${poster.id}-${index}`}
              className="flex-shrink-0 w-64 aspect-[4/5] rounded-2xl overflow-hidden border-2 border-black/5 hover:border-accent-pink transition-colors group cursor-pointer"
            >
              <img
                src={poster.url}
                alt={`Instagram Poster ${poster.id}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-12 text-center">
        <motion.a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-widest text-accent-pink hover:underline"
          whileHover={{ scale: 1.05 }}
        >
          Follow @kreshrts on Instagram
        </motion.a>
      </div>
    </section>
  );
};
