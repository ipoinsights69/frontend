import { IPODetailedData } from '@/app/types/IPO';

interface ListingTabProps {
  data: IPODetailedData;
}

const ListingTab = ({ data }: ListingTabProps) => {
  // This tab has been removed per request
  return (
    <div className="bg-white border border-gray-200 rounded-md p-6 flex justify-center items-center min-h-[200px]">
      <p className="text-gray-500">This tab has been removed.</p>
    </div>
  );
};

export default ListingTab; 