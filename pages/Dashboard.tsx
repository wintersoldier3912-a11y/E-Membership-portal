
import React, { useState } from 'react';
import { User } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    mobile: user.mobile || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    
    // Simulate API call: PATCH /api/profile
    try {
      await new Promise(r => setTimeout(r, 1000));
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">M</div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Portal</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your verification methods and personal profile.</p>
          </div>
          <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
            <p className="text-xs font-bold text-indigo-600 uppercase">Membership Status</p>
            <p className="text-sm font-bold text-indigo-900">Standard Member</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Membership ID</p>
              <h3 className="text-xl font-bold text-gray-900">{user.id.toUpperCase()}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Identity Verified</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <h3 className="text-lg font-bold text-gray-900">Authenticated Session</h3>
              </div>
            </div>
          </div>

          {/* Profile Management Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h4 className="font-bold text-gray-900">Personal Information</h4>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              <div className="p-8">
                {msg && (
                  <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {msg.text}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        type="text"
                        disabled={!isEditing || saving}
                        value={profile.name}
                        onChange={e => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:text-gray-500"
                        placeholder="Not set"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        disabled={!isEditing || saving}
                        value={profile.email}
                        onChange={e => setProfile({...profile, email: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:text-gray-500"
                        placeholder="Not set"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Mobile</label>
                      <input
                        type="tel"
                        disabled={!isEditing || saving}
                        value={profile.mobile}
                        onChange={e => setProfile({...profile, mobile: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:text-gray-500"
                        placeholder="Not set"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
