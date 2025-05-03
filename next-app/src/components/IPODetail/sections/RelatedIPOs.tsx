import Link from 'next/link';

const RelatedIPOs = () => {
  // In a real application, this data would come from an API
  const relatedIpos = [
    {
      id: 'techcore_ai',
      name: 'TechCore AI',
      sector: 'Technology',
      listingDate: 'Apr 15, 2025',
      gain: 68.4,
      initials: 'TC',
      color: 'blue'
    },
    {
      id: 'greenenergy_ltd',
      name: 'GreenEnergy Ltd',
      sector: 'Renewable Energy',
      listingDate: 'Mar 28, 2025',
      gain: 42.3,
      initials: 'GE',
      color: 'green'
    },
    {
      id: 'medihealth_inc',
      name: 'MediHealth Inc',
      sector: 'Healthcare',
      listingDate: 'Apr 2, 2025',
      gain: 35.9,
      initials: 'MH',
      color: 'purple'
    },
    {
      id: 'neoedu_platform',
      name: 'NeoEdu Platform',
      sector: 'EdTech',
      listingDate: 'Apr 19, 2025',
      gain: 10.2,
      initials: 'NE',
      color: 'yellow'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-8">
      <h2 className="text-lg font-medium text-gray-800 mb-4">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {relatedIpos.map((ipo) => (
          <div key={ipo.id} className="bg-white border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className={`w-8 h-8 bg-${ipo.color}-100 rounded-md flex items-center justify-center text-${ipo.color}-600 font-semibold text-sm mr-3`}>
                {ipo.initials}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">{ipo.name}</h3>
                <p className="text-xs text-gray-500">{ipo.sector}</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Listed: {ipo.listingDate}</span>
              <span className="text-green-600 font-medium">+{ipo.gain}%</span>
            </div>
            <Link href={`/ipo/${ipo.id}`} className="text-xs text-blue-600 hover:text-blue-800">
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedIPOs; 