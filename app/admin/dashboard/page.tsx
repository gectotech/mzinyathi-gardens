'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Users, Briefcase } from 'lucide-react';
import { jobs } from '@/lib/mockData';
import toast from 'react-hot-toast';

// Mock applications (in real app, fetch from DB)
const mockApplications = [
  { id: '1', fullName: 'John Doe', jobTitle: 'Security Officer', status: 'submitted', date: '2025-04-01' },
  { id: '2', fullName: 'Jane Smith', jobTitle: 'Construction Manager', status: 'under_review', date: '2025-04-02' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState(mockApplications);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast.success('Logged out');
    router.push('/admin/login');
  };

  const updateStatus = (id: string, newStatus: string) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    toast.success(`Status updated to ${newStatus}`);
  };

  if (!isAuthorized) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-dark text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center gap-2"><LogOut size={18} /> Logout</button>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-left">Applicant</th><th>Job</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} className="border-t">
                  <td className="px-6 py-4">{app.fullName}</td>
                  <td className="px-6 py-4">{app.jobTitle}</td>
                  <td className="px-6 py-4">
                    <select value={app.status} onChange={e => updateStatus(app.id, e.target.value)} className="border rounded p-1">
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">{app.date}</td>
                  <td className="px-6 py-4">
                    <button className="text-primary">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}