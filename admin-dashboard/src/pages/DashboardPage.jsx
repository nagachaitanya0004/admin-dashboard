import { useAuth } from '@/context/AuthContext';
import { LogOut, LayoutDashboard, Users, Bell, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const stats = [
    { name: 'Total Users', value: '10,245', change: '+12%', icon: Users },
    { name: 'Active Sessions', value: '1,024', change: '+5%', icon: Activity },
    { name: 'System Alerts', value: '3', change: '-2', icon: Bell, error: true },
  ];

  return (
    <div className="min-h-screen bg-base-dark">
      {/* Navbar */}
      <nav className="bg-base border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary/10 p-2 rounded-custom">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300 text-sm hidden sm:block">
                Welcome, {user?.name || 'Admin'}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-slate-700 rounded-custom text-sm font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 focus:outline-none transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.name}
              className="relative bg-base pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow-custom rounded-custom-lg border border-slate-800 overflow-hidden"
            >
              <dt>
                <div className={`absolute rounded-custom p-3 ${item.error ? 'bg-danger/10' : 'bg-primary/10'}`}>
                  <item.icon className={`h-6 w-6 ${item.error ? 'text-danger' : 'text-primary'}`} aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-slate-400 truncate">{item.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    item.change.startsWith('+') ? 'text-success' : 'text-danger'
                  }`}
                >
                  {item.change}
                </p>
              </dd>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-base rounded-custom-lg shadow-custom border border-slate-800">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-white mb-4">
              Recent Activity
            </h3>
            <div className="border-t border-slate-800">
              <div className="py-8 text-slate-400 text-sm text-center">
                No recent activity to show.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
