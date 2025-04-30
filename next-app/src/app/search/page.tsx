import React from 'react';
import { Metadata } from 'next';
import SearchPageClient from './SearchPageClient';

// Enable cache revalidation every hour
export const revalidate = 3600;

// Define dynamic metadata based on search query - this now works correctly on the server component
export async function generateMetadata({ searchParams }: { searchParams: { q: string } }): Promise<Metadata> {
  const { q } = searchParams;
  return {
    title: q ? `Search: ${q} - IPO Insights` : 'Search IPOs - IPO Insights',
    description: q ? `Search results for ${q} - Find IPO details, performance, and more on IPO Insights` : 'Search for IPOs, get detailed information, performance metrics, and more on IPO Insights',
  };
}

// Server component that renders the client component
export default function SearchPage({ searchParams }: { searchParams: { q?: string, page?: string } }) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10);
  
  return <SearchPageClient initialQuery={query} initialPage={page} />;
} 