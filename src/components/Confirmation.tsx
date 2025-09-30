import React from 'react';

interface ConfirmationProps {
  orderNumber: string;
  onDownload: () => void;
  emailEnabled: boolean;
}

const Confirmation: React.FC<ConfirmationProps> = ({ orderNumber, onDownload, emailEnabled }) => (
  <div className="max-w-xl mx-auto text-center py-12">
    <div className="text-3xl font-bold text-green-700 mb-4">Order Submitted!</div>
    <div className="text-lg mb-2">Your order number is <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderNumber}</span></div>
    <button
      className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition"
      onClick={onDownload}
    >
      Download Excel
    </button>
    {!emailEnabled && (
      <div className="mt-6 text-yellow-700 bg-yellow-100 rounded p-3 text-sm">
        Emails will be sent in final setup.
      </div>
    )}
  </div>
);

export default Confirmation;