import React from 'react';

export default function Api() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h1 className="text-4xl font-black uppercase mb-6">API Access</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Integrate TikDown's powerful video downloading capabilities directly into your own applications.
      </p>
      <div className="w-full max-w-3xl border-4 border-black dark:border-white bg-[#3b82f6] p-8 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#fff] text-left text-white">
        <h2 className="text-2xl font-bold mb-4 border-b-4 border-white pb-2 uppercase">Endpoints</h2>
        <div className="bg-black text-white p-4 font-mono text-lg mb-6 border-4 border-white">
          POST /api/v1/download
        </div>
        <p className="mb-4 font-bold text-lg">Requires an active API key. See pricing for more details.</p>
      </div>
    </div>
  );
}
