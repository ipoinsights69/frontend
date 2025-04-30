import { getUpcomingIPOData } from './ipoData';
import UpcomingIPOsClient from './UpcomingIPOsClient';

export default async function UpcomingIPOsPage() {
  // This is a Server Component that fetches data
  const ipoData = await getUpcomingIPOData();
  
  // Pass the data to the Client Component
  return <UpcomingIPOsClient ipoData={ipoData} />;
} 