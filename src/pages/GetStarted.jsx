import React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function GetStarted() {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    toast.success("Akun berhasil dibuat!");
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 max-w-3xl">
        Start Downloading Faster
      </h1>
      <p className="text-xl mb-12 max-w-2xl font-bold">
        Join thousands of users who have simplified their workflow with TikDown.
      </p>
      
      <div className="w-full max-w-md border-4 border-black dark:border-white bg-[#f472b6] p-8 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#fff] text-black">
        <h2 className="text-2xl font-bold uppercase mb-6 text-left">Create Account</h2>
        <form className="flex flex-col gap-4 text-left" onSubmit={handleSignUp}>
          <div>
            <label className="font-bold text-lg uppercase block mb-1">Name</label>
            <input type="text" required placeholder="Your Name" className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow" />
          </div>
          <div>
            <label className="font-bold text-lg uppercase block mb-1">Email</label>
            <input type="email" required placeholder="hello@example.com" className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow" />
          </div>
          <div>
            <label className="font-bold text-lg uppercase block mb-1">Password</label>
            <input type="password" required placeholder="********" className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow" />
          </div>
          <button type="submit" className="w-full mt-4 border-4 border-black bg-black text-white p-3 font-black uppercase text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0_0_#000]">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
