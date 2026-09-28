import React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    toast.success("Berhasil Login!");
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-full max-w-md border-4 border-black dark:border-white bg-[#facc15] p-8 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#fff] text-black">
        <h1 className="text-4xl font-black uppercase mb-6">Login</h1>
        <form className="flex flex-col gap-4 text-left" onSubmit={handleLogin}>
          <div>
            <label className="font-bold text-lg uppercase block mb-1">Email</label>
            <input type="email" required placeholder="hello@example.com" className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow" />
          </div>
          <div>
            <label className="font-bold text-lg uppercase block mb-1">Password</label>
            <input type="password" required placeholder="********" className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow" />
          </div>
          <button type="submit" className="w-full mt-4 border-4 border-black bg-white p-3 font-black uppercase text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0_0_#000]">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
