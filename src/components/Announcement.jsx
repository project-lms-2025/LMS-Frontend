import React from 'react';

const Announcement = () => {
  const lorem = `Gravida metus id ipsum lectus leo. Nibh dui cursus donec nulla tempus urna urna nullam. 
  Ac pellentesque augue aliquam faucibus tortor sit ante ipsum feugiat. Etiam eu nec 
  montes massa sit velit. Adipiscing nunc amet ornare sit nibh et quam facilisis. 
  Sed cursus enim pretium ultrices arcu scelerisque dignissim molestie eu. 
  Nec non est etiam eget. Natoque in magna eget mauris ultrices. Purus volutpat habitasse.`;

  return (
    <div className="space-y-6 p-4  min-h-screen">
      {/* Terms and Conditions */}
      <div className="bg-white p-6 rounded-lg shadow relative">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-blue-600">
            Terms and Conditions
          </h3>
          <span className="text-sm text-gray-500">
            Held on Mar 5, 2025, 9:30 am
          </span>
        </div>

        <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
          {lorem}
        </p>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Nope😖
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            I agree
          </button>
        </div>
      </div>

      {/* Successfully applied! (1) */}
      <div className="bg-white p-6 rounded-lg shadow relative">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-blue-600">
            Successfully applied!
          </h3>
          <span className="text-sm text-gray-500">
            Held on Mar 5, 2025, 9:30 am
          </span>
        </div>

        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {lorem}
        </p>
      </div>

      {/* Successfully applied! (2) */}
      <div className="bg-white p-6 rounded-lg shadow relative">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-blue-600">
            Successfully applied!
          </h3>
          <span className="text-sm text-gray-500">
            Held on Mar 5, 2025, 9:30 am
          </span>
        </div>

        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {lorem}
        </p>
      </div>
    </div>
  );
};

export default Announcement;
