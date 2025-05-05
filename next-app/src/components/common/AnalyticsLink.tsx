'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { trackEvent } from '@/lib/analytics';

interface AnalyticsLinkProps extends LinkProps {
  linkText: string;
  linkCategory?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function AnalyticsLink({
  linkText,
  linkCategory = 'navigation',
  className = '',
  href,
  children,
  ...props
}: AnalyticsLinkProps) {
  const handleClick = () => {
    // Track the link click in analytics
    trackEvent({
      action: 'link_click',
      category: linkCategory,
      label: linkText,
      destination: typeof href === 'object' ? JSON.stringify(href) : href.toString(),
    });
  };

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children || linkText}
    </Link>
  );
} 