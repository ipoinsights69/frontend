'use client';

import Link from 'next/link';

interface AllotmentCheckButtonProps {
  ipoId: string;
  status: string;
}

export default function AllotmentCheckButton({ ipoId, status }: AllotmentCheckButtonProps) {
  if (!['closed', 'listed'].includes(status)) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <Link 
        href={`/ipo/${ipoId}/allotment`}
        className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Check Allotment Status
      </Link>
    </div>
  );
} 