import { motion, useReducedMotion } from 'motion/react';

const headline = [
  { text: 'Explore', accent: false },
  { text: 'careers.', accent: true },
  { text: 'Discover', accent: false },
  { text: 'possibilities.', accent: true },
];

export default function KineticHeadline() {
  const reducedMotion = useReducedMotion();

  return (
    <h1 id="hero-heading" className="hero-headline">
      <span className="sr-only">Explore careers. Discover possibilities.</span>

      <span aria-hidden="true" className="hero-headline-visual">
        <span className="hero-headline-line">
          {headline.slice(0, 2).map((word, index) => (
            <motion.span
              key={word.text}
              className={
                word.accent ? 'hero-headline-word hero-headline-accent' : 'hero-headline-word'
              }
              initial={reducedMotion ? false : { opacity: 0, y: 35, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: reducedMotion ? 0 : 0.65,
                delay: reducedMotion ? 0 : index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word.text}
            </motion.span>
          ))}
        </span>

        <span className="hero-headline-line">
          {headline.slice(2).map((word, index) => (
            <motion.span
              key={word.text}
              className={
                word.accent ? 'hero-headline-word hero-headline-accent' : 'hero-headline-word'
              }
              initial={reducedMotion ? false : { opacity: 0, y: 35, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: reducedMotion ? 0 : 0.65,
                delay: reducedMotion ? 0 : (index + 2) * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word.text}
            </motion.span>
          ))}
        </span>
      </span>
    </h1>
  );
}
