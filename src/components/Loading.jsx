import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-t-primary-purple border-secondary-gray rounded-full animate-spin"></div>
        <p className="mt-4 text-xl font-semibold text-primary-purple">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
