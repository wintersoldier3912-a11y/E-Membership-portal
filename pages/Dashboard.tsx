
import React, { useState, useEffect } from 'react';
import { User, ProfileData, UserPreferences } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    bio: '',
    preferences: {
      marketingEmails: false,
      smsNotifications: true
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // In a real environment, this fetches from the protected API
      const response = await fetch('/api/profile');
      const result = await response.json();
      if (result.success) {
        setProfile({
          name: result.data.name || '',
          email: result.data.email || '',
          bio: result.data.bio || '',
          preferences: result.data.preferences || { marketingEmails: false, smsNotifications: true }
        });
      }
    } catch (err) {
      console.error(err);
      // Fallback for demo/dev purposes if server not running
      setMsg({ type: 'error', text: 'Server connection failed. Using local state.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      
      const result = await response.json();
      if (result.success) {
        setMsg({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        setMsg({ type: 'error', text: result.message || 'Update failed.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Network error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key: keyof UserPreferences) => {
    if (!isEditing) return;
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key]
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Synchronizing Session...</p>
        </div>
      </div>
    );
  }

  const memberDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">M</div>
          <div>
            <span className="text-xl font-bold text-gray-900 tracking-tight block leading-tight">MemberPortal</span>
            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Enterprise Edition</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Live Connection
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all hover:shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome, {profile.name || 'Member'}</h1>
            <p className="text-gray-500 text-lg">Securely manage your portal profile and notification preferences.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Member Since</p>
              <p className="text-sm font-bold text-gray-900">{memberDate}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Security Level</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">OTP Auth</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase">Active</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">JWT Token</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase">HttpOnly</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">SSL Encryption</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase">TLS 1.3</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Account Reference</p>
                <code className="block bg-gray-50 p-3 rounded-xl text-xs font-mono text-gray-500 break-all border border-gray-100 uppercase">
                  {user.id}
                </code>
              </div>
            </div>

            <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
              <h4 className="font-bold text-lg mb-2">Need Support?</h4>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Our membership team is available 24/7 to assist with your security inquiries.</p>
              <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">Contact Expert</button>
            </div>
          </div>

          {/* Profile Management Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                  <h4 className="font-bold text-gray-900 text-lg">Account Profile</h4>
                </div>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-all text-sm"
                  >
                    Modify Profile
                  </button>
                )}
              </div>
              
              <div className="p-8">
                {msg && (
                  <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <div className={`w-2 h-2 rounded-full ${msg.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {msg.text}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Legal Name</label>
                      <input
                        type="text"
                        disabled={!isEditing || saving}
                        value={profile.name}
                        onChange={e => setProfile({...profile, name: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400 font-medium"
                        placeholder="e.g. Alexander Pierce"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Primary Email</label>
                      <input
                        type="email"
                        disabled={!isEditing || saving}
                        value={profile.email}
                        onChange={e => setProfile({...profile, email: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400 font-medium"
                        placeholder="alex@domain.com"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Professional Bio</label>
                      <textarea
                        disabled={!isEditing || saving}
                        value={profile.bio}
                        rows={4}
                        onChange={e => setProfile({...profile, bio: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400 font-medium resize-none"
                        placeholder="Tell the community about your expertise and interests..."
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                      Communication Settings
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div 
                        onClick={() => togglePreference('marketingEmails')}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${profile.preferences.marketingEmails ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:border-gray-200'} ${!isEditing && 'opacity-70 cursor-not-allowed'}`}
                      >
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Marketing Emails</p>
                          <p className="text-xs text-gray-500">Updates on new features</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full transition-colors relative ${profile.preferences.marketingEmails ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${profile.preferences.marketingEmails ? 'left-6' : 'left-1'}`}></div>
                        </div>
                      </div>

                      <div 
                        onClick={() => togglePreference('smsNotifications')}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${profile.preferences.smsNotifications ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:border-gray-200'} ${!isEditing && 'opacity-70 cursor-not-allowed'}`}
                      >
                        <div>
                          <p className="font-bold text-gray-900 text-sm">SMS Security Alerts</p>
                          <p className="text-xs text-gray-500">Critical account changes</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full transition-colors relative ${profile.preferences.smsNotifications ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${profile.preferences.smsNotifications ? 'left-6' : 'left-1'}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-6 border-t border-gray-100">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Synchronizing...
                          </>
                        ) : 'Save Updates'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          fetchProfile(); // Reset fields to DB state
                        }}
                        className="px-8 py-3 border border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                      >
                        Discard Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
            
            <div className="p-8 bg-gray-900 rounded-3xl text-gray-400 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-white font-bold">Privacy Control Center</p>
                <p className="text-xs">Your data is encrypted using AES-256 standard before being stored in our enterprise vaults.</p>
              </div>
              <button className="px-5 py-2.5 bg-gray-800 text-xs font-black rounded-xl hover:bg-gray-700 transition-colors uppercase tracking-widest text-white border border-gray-700">Download Vault Audit</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
