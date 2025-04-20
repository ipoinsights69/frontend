'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatOptions?: Intl.NumberFormatOptions;
  className?: string;
  prefix?: string;
  suffix?: string;
}

const AnimatedNumber = ({
  value,
  duration = 2,
  formatOptions = {},
  className = '',
  prefix = '',
  suffix = ''
}: AnimatedNumberProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Configure spring animation
  const spring = useSpring(count, {
    damping: 50,
    stiffness: 100,
    duration: duration * 1000
  });
  
  // Format the number based on options
  const displayValue = useTransform(rounded, latest => {
    return new Intl.NumberFormat('en-US', formatOptions).format(latest);
  });
  
  useEffect(() => {
    if (inView && !hasAnimated) {
      spring.set(value);
      setHasAnimated(true);
    }
  }, [inView, value, spring, hasAnimated]);
  
  return (
    <motion.span 
      ref={ref}
      className={className}
    >
      {prefix}<motion.span>{displayValue}</motion.span>{suffix}
    </motion.span>
  );
};

export default AnimatedNumber; 