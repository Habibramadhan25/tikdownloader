import React from 'react';

export default function Pricing() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h1 className="text-4xl font-black uppercase mb-6">Pricing Plans</h1>
      <p className="text-xl mb-12 max-w-2xl">
        Choose the perfect plan for your needs. Simple, transparent pricing.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000] flex flex-col text-black">
          <h2 className="text-3xl font-bold mb-2 uppercase">Free</h2>
          <p className="text-5xl font-black mb-6">$0 <span className="text-xl font-bold uppercase">/month</span></p>
          <ul className="text-left mb-8 flex-1 space-y-3">
            <li className="font-bold text-lg">✓ 10 downloads per day</li>
            <li className="font-bold text-lg">✓ Standard quality</li>
            <li className="font-bold text-lg">✓ Web access</li>
          </ul>
          <button className="w-full border-4 border-black bg-[#facc15] p-4 font-black uppercase text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0_0_#000]">
            Get Started
          </button>
        </div>
        
        <div className="border-4 border-black bg-[#f472b6] p-8 shadow-[8px_8px_0_0_#000] flex flex-col text-black">
          <h2 className="text-3xl font-bold mb-2 uppercase">Pro</h2>
          <p className="text-5xl font-black mb-6">$9.99 <span className="text-xl font-bold uppercase">/month</span></p>
          <ul className="text-left mb-8 flex-1 space-y-3">
            <li className="font-bold text-lg">✓ Unlimited downloads</li>
            <li className="font-bold text-lg">✓ Highest quality</li>
            <li className="font-bold text-lg">✓ API Access</li>
            <li className="font-bold text-lg">✓ Priority support</li>
          </ul>
          <button className="w-full border-4 border-black bg-black text-white p-4 font-black uppercase text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0_0_#000]">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
}
