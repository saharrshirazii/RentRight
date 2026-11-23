import React from 'react';
import CreateListing from '../../components/Host/listings/CreateListing';

const HostIndex: React.FC = () => {
  return (
    <div>
      <h1>Host Dashboard</h1>
      <CreateListing />
    </div>
  );
};

export default HostIndex;
