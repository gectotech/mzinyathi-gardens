'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        const raw = d.settings || {};
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(raw)) {
          flat[k] = typeof v === 'string' ? v : JSON.stringify(v).replace(/^"|"$/g, '');
        }
        setSettings(flat);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    if (res.ok) toast.success('Settings saved');
    else toast.error('Failed to save settings');
  };

  const fields = [
    { key: 'site_name', label: 'Site Name' },
    { key: 'contact_email', label: 'Contact Email (public)' },
    { key: 'reply_email', label: 'Reply Email (admin replies from this address)' },
    { key: 'phone_za', label: 'South Africa Phone' },
    { key: 'phone_zw_1', label: 'Zimbabwe Phone 1' },
    { key: 'phone_zw_2', label: 'Zimbabwe Phone 2' },
    { key: 'facebook_url', label: 'Facebook URL' },
    { key: 'instagram_url', label: 'Instagram URL' },
    { key: 'google_play_url', label: 'Google Play URL' },
    { key: 'app_store_url', label: 'App Store URL' },
  ];

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <form onSubmit={save} className="bg-white rounded-lg shadow p-6 space-y-4">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={settings[key] || ''}
              onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
            />
          </div>
        ))}
        <button type="submit" className="bg-[#4169E1] text-white px-6 py-2 rounded-md">
          Save Settings
        </button>
      </form>
    </div>
  );
}
