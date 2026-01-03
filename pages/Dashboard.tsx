
import React, { useState, useEffect } from 'react';
import { User, ProfileData, UserPreferences, AuthMethod } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    bio: '',
    avatarUrl: '',
    preferredAuthMethod: 'sms',
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
      const response = await fetch('/api/profile');
      const result = await response.json();
      if (result.success) {
        setProfile({
          name: result.data.name || '',
          email: result.data.email || '',
          bio: result.data.bio || '',
          avatarUrl: result.data.avatarUrl || '',
          preferredAuthMethod: result.data.preferredAuthMethod || 'sms',
          preferences: result.data.preferences || { marketingEmails: false, smsNotifications: true }
        });
      }
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Server connection failed.' });
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
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-indigo-100 border-4 border-white shadow-xl overflow-hidden flex-shrink-0">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{profile.name || 'Member Account'}</h1>
              <p className="text-gray-500 text-lg">Manage your identity and authentication preferences.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Member Since</p>
              <p className="text-sm font-bold text-gray-900">{memberDate}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Verification Info</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Preferred Method</span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-black uppercase">{profile.preferredAuthMethod}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Mobile</span>
                    <span className="text-gray-900 font-medium">{user.mobile || 'Not linked'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h4 className="font-bold text-gray-900 text-lg">Account Profile</h4>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="text-indigo-600 font-bold text-sm">Edit Profile</button>
                )}
              </div>
              
              <div className="p-8">
                {msg && (
                  <div className={`mb-6 p-4 rounded-2xl text-sm font-bold ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {msg.text}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Display Name</label>
                      <input
                        type="text"
                        disabled={!isEditing || saving}
                        value={profile.name}
                        onChange={e => setProfile({...profile, name: e.target.value})}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-500 disabled:opacity-50"
                        placeholder="Alexander Pierce"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Avatar URL</label>
                      <input
                        type="text"
                        disabled={!isEditing || saving}
                        value={profile.avatarUrl}
                        onChange={e => setProfile({...profile, avatarUrl: e.target.value})}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-500 disabled:opacity-50"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Authentication Preference</label>
                      <div className="flex gap-4">
                        {(['sms', 'email'] as AuthMethod[]).map(m => (
                          <button
                            key={m}
                            type="button"
                            disabled={!isEditing || saving}
                            onClick={() => setProfile({...profile, preferredAuthMethod: m})}
                            className={`flex-1 py-3 px-4 rounded-2xl border-2 font-bold transition-all ${profile.preferredAuthMethod === m ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-gray-400 hover:border-gray-200'} disabled:opacity-50`}
                          >
                            Verify via {m.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Bio</label>
                      <textarea
                        disabled={!isEditing || saving}
                        value={profile.bio}
                        rows={3}
                        onChange={e => setProfile({...profile, bio: e.target.value})}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-500 disabled:opacity-50 resize-none"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-6 border-t border-gray-100">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg disabled:opacity-50"
                      >
                        {saving ? 'Synchronizing...' : 'Save Updates'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); fetchProfile(); }}
                        className="px-8 py-3 border border-gray-300 text-gray-700 font-bold rounded-2xl"
                      >
                        Discard
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
