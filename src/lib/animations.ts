/**
 * Framer Motion Animation Variants
 *
 * Professional, subtle animations for Budget Dashboard.
 * All animations use consistent timing and easing for polish.
 */

import { type Variants } from './framer-client';

// Timing constants for consistency
const TIMING = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.4,
  verySlow: 0.6,
} as const;

const EASING = {
  ease: [0.4, 0, 0.2, 1], // cubic-bezier for smooth transitions
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
} as const;

/**
 * Basic fade in/out animation
 */
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: TIMING.normal,
      ease: EASING.ease,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: TIMING.fast,
      ease: EASING.easeIn,
    },
  },
};

export const fadeOut: Variants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 0,
    transition: {
      duration: TIMING.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Slide in animations from different directions
 */
export const slideInFromLeft: Variants = {
  initial: {
    opacity: 0,
    x: -24,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: TIMING.slow,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: {
      duration: TIMING.normal,
      ease: EASING.easeIn,
    },
  },
};

export const slideInFromRight: Variants = {
  initial: {
    opacity: 0,
    x: 24,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: TIMING.slow,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: 24,
    transition: {
      duration: TIMING.normal,
      ease: EASING.easeIn,
    },
  },
};

export const slideInFromTop: Variants = {
  initial: {
    opacity: 0,
    y: -24,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.slow,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -24,
    transition: {
      duration: TIMING.normal,
      ease: EASING.easeIn,
    },
  },
};

export const slideInFromBottom: Variants = {
  initial: {
    opacity: 0,
    y: 24,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.slow,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: 24,
    transition: {
      duration: TIMING.normal,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Scale in animation for cards and modals
 */
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: TIMING.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: TIMING.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Treemap transition for D3 visualizations
 * Smooth transitions for data updates
 */
export const treemapTransition = {
  duration: TIMING.verySlow,
  ease: EASING.ease,
};

/**
 * Carousel slide animations
 */
export const carouselSlide: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: TIMING.slow,
      ease: EASING.ease,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: {
      duration: TIMING.slow,
      ease: EASING.ease,
    },
  }),
};

/**
 * Stagger children for lists
 * Use with parent container
 */
export const staggerChildren: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * Individual child item for stagger
 */
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: {
      duration: TIMING.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Hover scale for interactive elements
 * Use with whileHover prop
 */
export const hoverScale = {
  scale: 1.02,
  transition: {
    duration: TIMING.fast,
    ease: EASING.ease,
  },
};

/**
 * Subtle hover lift for cards
 */
export const hoverLift = {
  y: -4,
  transition: {
    duration: TIMING.fast,
    ease: EASING.ease,
  },
};

/**
 * Active/pressed state
 * Use with whileTap prop
 */
export const tapScale = {
  scale: 0.98,
  transition: {
    duration: 0.1,
    ease: EASING.ease,
  },
};

/**
 * Skeleton loading pulse
 */
export const skeletonPulse: Variants = {
  initial: {
    opacity: 0.6,
  },
  animate: {
    opacity: [0.6, 0.8, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Modal overlay fade
 */
export const modalOverlay: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: TIMING.fast,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: TIMING.fast,
    },
  },
};

/**
 * Modal content with slight scale
 */
export const modalContent: Variants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: TIMING.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 20,
    transition: {
      duration: TIMING.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Number counter animation
 * For use with custom counter components
 */
export const numberCounter = {
  duration: TIMING.verySlow,
  ease: EASING.ease,
};

/**
 * Page transition variants
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.slow,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: TIMING.normal,
      ease: EASING.easeIn,
    },
  },
};
