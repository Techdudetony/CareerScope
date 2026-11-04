export const motionPresets = {
  fadeUp: {
    hidden: {
      opacity: 0,
      y: 28,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  },

  fadeIn: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  },

  scaleIn: {
    hidden: {
      opacity: 0,
      scale: 0.94,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  },
};

export const motionTransitions = {
  smooth: {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1],
  },

  spring: {
    type: 'spring',
    stiffness: 260,
    damping: 24,
  },
};
