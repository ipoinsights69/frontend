'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  animationVariant?: 'fade' | 'slide-up' | 'slide-right' | 'scale';
  gradient?: boolean;
  delay?: number;
}

const MotionCard: React.FC<MotionCardProps> = ({
  children,
  className = '',
  animationVariant = 'fade',
  gradient = true,
  delay = 0,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    'slide-up': {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
    },
    'slide-right': {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  const gradientStyles = gradient 
    ? 'bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm border border-gray-100 dark:border-gray-700' 
    : '';
  
  const baseStyles = 'rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden';

  return (
    <motion.div
      ref={ref}
      className={`${baseStyles} ${gradientStyles} ${className}`}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[animationVariant]}
      transition={{ 
        duration: 0.5, 
        ease: "easeOut",
        delay: delay
      }}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default MotionCard; 