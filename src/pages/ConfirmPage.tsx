import React from 'react';
import Header from '../components/Header';
import Confirmation from '../components/Confirmation';

const ConfirmPage: React.FC = () => {
  // Placeholder for order number, download handler, and emailEnabled flag
  return (
    <div>
      <Header />
      <Confirmation orderNumber="TEMP123" onDownload={() => {}} emailEnabled={false} />
    </div>
  );
};

export default ConfirmPage;