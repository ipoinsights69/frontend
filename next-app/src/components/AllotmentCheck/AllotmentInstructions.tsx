'use client';

interface AllotmentInstructionsProps {
  registrarName: string;
}

export default function AllotmentInstructions({ registrarName }: AllotmentInstructionsProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-3">Using PAN Number</h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
          <li>Select the PAN Number tab at the top of the form.</li>
          <li>Enter your 10-digit PAN number (in the format ABCDE1234F).</li>
          <li>Click on the "Check Allotment Status" button.</li>
          <li>Your allotment status will be displayed immediately.</li>
        </ol>
      </div>
      
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-3">Using Application Number</h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
          <li>Select the Application Number tab at the top of the form.</li>
          <li>Enter your application number from your bidding confirmation slip.</li>
          <li>Click on the "Check Allotment Status" button.</li>
          <li>Your allotment status will be displayed immediately.</li>
        </ol>
      </div>
      
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-3">Using Demat Account</h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
          <li>Select the Demat Account tab at the top of the form.</li>
          <li>Enter your DP ID (e.g., IN300476) and Client ID.</li>
          <li>Click on the "Check Allotment Status" button.</li>
          <li>Your allotment status will be displayed immediately.</li>
        </ol>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Important Note</h3>
        <p className="text-sm text-blue-700">
          You can also check your allotment status directly on {registrarName}'s official website. 
          Please note that it might take some time for the allotment status to be updated in the system 
          after the official allotment date.
        </p>
      </div>
      
      <p className="text-sm text-gray-500">
        If you face any issues while checking your allotment status, please contact {registrarName} 
        directly with your application details.
      </p>
    </div>
  );
} 