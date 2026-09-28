import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  Users, Video, HardDrive, Activity, ShieldCheck, CheckCircle2, XCircle
} from 'lucide-react';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('tikdown_admin_auth') === 'true'
  );
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProcessed: 0,
    totalHistory: 0,
    localUsers: 1,
  });

  useEffect(() => {
    if (!isLoggedIn) return;
    const history = JSON.parse(localStorage.getItem('tikdown_history') || '[]');
    const totalProcessedCount = parseInt(localStorage.getItem('tikdown_total_processed') || '0', 10);
    setStats({
      totalProcessed: Math.max(history.length, totalProcessedCount),
      totalHistory: history.length,
      localUsers: 1
    });
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('tikdown_admin_auth');
    setIsLoggedIn(false);
    navigate('/admin/login');
  };

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto min-h-[80vh] flex flex-col animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[hsl(var(--border))] pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Admin Dashboard</h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">Monitor system statistics (Local Preview)</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-colors shadow-sm"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[hsl(var(--muted-foreground))] font-medium">Total Users</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-[hsl(var(--foreground))]">{stats.localUsers}</p>
          <p className="text-xs text-blue-500 mt-2 font-medium bg-blue-500/10 px-2 py-1 rounded w-max">Active Local User</p>
        </div>
        
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[hsl(var(--muted-foreground))] font-medium">Downloads (All Time)</h3>
            <Video className="w-5 h-5 text-pink-500" />
          </div>
          <p className="text-3xl font-bold text-[hsl(var(--foreground))]">{stats.totalProcessed}</p>
          <p className="text-xs text-green-500 mt-2 font-medium bg-green-500/10 px-2 py-1 rounded w-max">Success Rate: 99%</p>
        </div>

        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[hsl(var(--muted-foreground))] font-medium">Items in History</h3>
            <HardDrive className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-[hsl(var(--foreground))]">{stats.totalHistory}</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 font-medium bg-[hsl(var(--muted))] px-2 py-1 rounded w-max">Saved on Device</p>
        </div>

        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[hsl(var(--muted-foreground))] font-medium">API Server Status</h3>
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-[hsl(var(--foreground))]">Online</p>
          <p className="text-xs text-green-500 mt-2 font-medium bg-green-500/10 px-2 py-1 rounded w-max">Latency: 124ms</p>
        </div>
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl overflow-hidden mb-8">
          <div className="p-6 border-b border-[hsl(var(--border))]">
            <h3 className="font-bold text-lg">Recent User Activities (Mock)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[hsl(var(--muted))]/50 text-[hsl(var(--muted-foreground))]">
                <tr>
                  <th className="px-6 py-4 font-medium">User ID</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                <tr className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                  <td className="px-6 py-4">#USR-8492</td>
                  <td className="px-6 py-4">Downloaded Video</td>
                  <td className="px-6 py-4"><span className="flex items-center gap-1 text-green-500"><CheckCircle2 className="w-4 h-4"/> Success</span></td>
                  <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">Just now</td>
                </tr>
                <tr className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                  <td className="px-6 py-4">#USR-1029</td>
                  <td className="px-6 py-4">Upgraded to Premium</td>
                  <td className="px-6 py-4"><span className="flex items-center gap-1 text-green-500"><CheckCircle2 className="w-4 h-4"/> Success</span></td>
                  <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">2 mins ago</td>
                </tr>
                <tr className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                  <td className="px-6 py-4">#USR-3391</td>
                  <td className="px-6 py-4">Payment Failed</td>
                  <td className="px-6 py-4"><span className="flex items-center gap-1 text-red-500"><XCircle className="w-4 h-4"/> Failed</span></td>
                  <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">1 hour ago</td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
