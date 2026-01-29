'use client';

/**
 * Client-side wrapper for framer-motion to ensure React 19 compatibility
 * All framer-motion imports should go through this file
 */

export {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useInView,
  useAnimation,
  useMotionValueEvent,
  type Variants,
  type Transition,
  type MotionProps,
} from 'framer-motion';
