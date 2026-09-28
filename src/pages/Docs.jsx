import React from 'react';

export default function Docs() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h1 className="text-4xl font-black uppercase mb-6">Documentation</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Learn how to use TikDown to download your favorite videos quickly and efficiently.
      </p>
      <div className="w-full max-w-3xl border-4 border-black dark:border-white bg-[#a3e635] p-8 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#fff] text-left text-black">
        <h2 className="text-2xl font-bold mb-4 border-b-4 border-black pb-2">Getting Started</h2>
        <p className="mb-4 font-bold text-lg">1. Copy the video URL from the platform.</p>
        <p className="mb-4 font-bold text-lg">2. Paste it into the input field on our home page.</p>
        <p className="mb-4 font-bold text-lg">3. Click the Download button to get your file.</p>
      </div>
    </div>
  );
}
