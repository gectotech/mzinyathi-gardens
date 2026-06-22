'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock, CreditCard, Mail, FileText, AlertCircle, User, BookOpen, DollarSign, Calendar, MessageSquare, LogOut, Menu, X, Home, Settings, Award, ClipboardList, Receipt, History, Lock, FileEdit, FileCheck, Wallet, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type NavItem = {
  id: string;
  label: string;
  icon: any;
  path: string;
};

export default function AdmissionsDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeNav, setActiveNav] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('portalUser');
    if (stored) {
      setUser({ firstname: 'Mila', lastname: 'Doe', studentNumber: 'R216988M', email: 'mila.doe@example.com' });
    } else {
      router.push('/school/student-portal');
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-blue-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const navItems: NavItem[] = [
    { id: 'profile', label: 'Student Profile', icon: User, path: '/profile' },
    { id: 'edit-profile', label: 'Edit Profile', icon: FileEdit, path: '/edit-profile' },
    { id: 'generic-quotation', label: 'Generic Quotation', icon: FileCheck, path: '/generic-quotation' },
    { id: 'invoice-quotation', label: 'Invoice/Quotation', icon: Receipt, path: '/invoice-quotation' },
    { id: 'online-payments', label: 'Online Payments', icon: Wallet, path: '/online-payments' },
    { id: 'financial-statement', label: 'Financial Statement', icon: DollarSign, path: '/financial-statement' },
    { id: 'registration-history', label: 'Registration History', icon: History, path: '/registration-history' },
    { id: 'registration', label: 'Registration', icon: ClipboardList, path: '/registration' },
    { id: 'results', label: 'Results', icon: Award, path: '/results' },
    { id: 'exam-timetable', label: 'Exam Timetable', icon: Calendar, path: '/exam-timetable' },
    { id: 'assessment', label: 'Assessment', icon: BookOpen, path: '/assessment' },
    { id: 'change-password', label: 'Change Password', icon: Lock, path: '/change-password' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/feedback' },
  ];

  const stats = [
    { label: 'Application Status', value: 'Under Review', icon: Clock, color: '#f5a623', bg: '#fff8ee' },
    { label: 'Documents Submitted', value: '4 / 6', icon: FileText, color: '#0b2d6b', bg: '#eef2fb' },
    { label: 'Payments Made', value: 'ZWL 0', icon: CreditCard, color: '#2ecc71', bg: '#eefbf3' },
    { label: 'Messages', value: '1 Unread', icon: Mail, color: '#c5252b', bg: '#fdeef0' },
  ];

  const timeline = [
    { label: 'Application Received', done: true, date: 'Jun 2 2025' },
    { label: 'Documents Verified', done: true, date: 'Jun 5 2025' },
    { label: 'Assessment Review', done: false, date: 'Pending' },
    { label: 'Final Decision', done: false, date: 'TBD' },
    { label: 'Enrolment', done: false, date: 'Jan 2027' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('portalUser');
    router.push('/school/student-portal');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-blue-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-blue-950 text-white overflow-hidden">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-lg rounded-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-950/80 to-black/80 backdrop-blur-xl border-r border-blue-500/20 z-40 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto`}>
        <div className="p-6 flex flex-col min-h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-red-500/30 border border-blue-400/40 flex items-center justify-center">
              <User size={24} className="text-blue-400" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Mila Doe</h2>
              <p className="text-sm text-gray-400">R216988M</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1 overflow-y-auto pb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeNav === item.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-red-500/20 border border-blue-400/30 text-blue-400'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <Link
            href="/school"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-400 hover:bg-blue-500/10 transition mt-8"
          >
            <Home size={20} />
            <span>MGPS Website</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-950/50 to-black/50 backdrop-blur-xl border-b border-blue-500/20 px-6 py-4 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/school/slo.png"
                alt="MGPS"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <h1 className="font-bold text-lg">Welcome to MIRA</h1>
                <p className="text-xs text-gray-400">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">Mila Doe</p>
                <p className="text-xs text-gray-400">R216988M</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30 rounded-xl text-red-400 hover:from-red-500/30 hover:to-red-600/30 transition"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeNav === 'edit-profile' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue="mila.doe@example.com"
                        className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        defaultValue="+263 71 234 5678"
                        className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Physical Address</label>
                    <textarea
                      defaultValue="123 Main St, Harare"
                      rows={3}
                      className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Guardian Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Guardian Contact Number</label>
                      <input
                        type="tel"
                        defaultValue="+263 71 234 5679"
                        className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Emergency Contact Information</label>
                    <input
                      type="tel"
                      defaultValue="+263 71 234 5680"
                      className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-red-500 text-white font-bold rounded-xl hover:from-blue-400 hover:to-red-400 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeNav === 'generic-quotation' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Generic Quotation</h2>
                <div className="space-y-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-4">Fee Item</th>
                        <th className="text-right py-3 px-4">Amount (ZWL)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4">Tuition Fees</td>
                        <td className="text-right py-3 px-4">150,000</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4">Development Levy</td>
                        <td className="text-right py-3 px-4">50,000</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4">Technology Fees</td>
                        <td className="text-right py-3 px-4">20,000</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4">Activity Fees</td>
                        <td className="text-right py-3 px-4">15,000</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4">Boarding Fees</td>
                        <td className="text-right py-3 px-4">100,000</td>
                      </tr>
                      <tr className="font-bold">
                        <td className="py-3 px-4">Total</td>
                        <td className="text-right py-3 px-4">335,000</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex gap-4 mt-6">
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-400/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition">
                      <FileText size={18} />
                      Download PDF
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-400 hover:bg-red-500/30 transition">
                      <FileText size={18} />
                      Print Quotation
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeNav === 'invoice-quotation' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Invoice / Quotation</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Invoice Number</th>
                      <th className="text-left py-3 px-4">Invoice Date</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-right py-3 px-4">Amount</th>
                      <th className="text-right py-3 px-4">Balance</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">INV-2027-001</td>
                      <td className="py-3 px-4">2027-01-15</td>
                      <td className="py-3 px-4">Term 1 Fees</td>
                      <td className="text-right py-3 px-4">335,000</td>
                      <td className="text-right py-3 px-4">335,000</td>
                      <td className="text-center py-3 px-4"><span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">Unpaid</span></td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">INV-2027-002</td>
                      <td className="py-3 px-4">2027-01-20</td>
                      <td className="py-3 px-4">Uniform Fees</td>
                      <td className="text-right py-3 px-4">45,000</td>
                      <td className="text-right py-3 px-4">45,000</td>
                      <td className="text-center py-3 px-4"><span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">Unpaid</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeNav === 'online-payments' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Online Payments</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-950/30 to-black/30 rounded-xl p-6">
                    <p className="text-gray-400 mb-2">Current Outstanding Balance</p>
                    <p className="text-3xl font-bold text-red-400">ZWL 380,000</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-950/30 to-black/30 rounded-xl p-6">
                    <p className="text-gray-400 mb-2">Payment Due Date</p>
                    <p className="text-3xl font-bold">2027-02-28</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-950/30 to-black/30 rounded-xl p-6">
                    <p className="text-gray-400 mb-2">Total Paid</p>
                    <p className="text-3xl font-bold text-green-400">ZWL 0</p>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Payment Methods</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-gradient-to-br from-blue-950/30 to-black/30 border border-blue-500/30 rounded-xl hover:border-blue-400 transition text-center">
                      <Wallet className="mx-auto mb-2" size={24} />
                      <p className="text-sm">Bank Transfer</p>
                    </button>
                    <button className="p-4 bg-gradient-to-br from-blue-950/30 to-black/30 border border-blue-500/30 rounded-xl hover:border-blue-400 transition text-center">
                      <CreditCard className="mx-auto mb-2" size={24} />
                      <p className="text-sm">Mobile Money</p>
                    </button>
                    <button className="p-4 bg-gradient-to-br from-blue-950/30 to-black/30 border border-blue-500/30 rounded-xl hover:border-blue-400 transition text-center">
                      <DollarSign className="mx-auto mb-2" size={24} />
                      <p className="text-sm">ZIPIT</p>
                    </button>
                    <button className="p-4 bg-gradient-to-br from-blue-950/30 to-black/30 border border-blue-500/30 rounded-xl hover:border-blue-400 transition text-center">
                      <CreditCard className="mx-auto mb-2" size={24} />
                      <p className="text-sm">Card Payment</p>
                    </button>
                  </div>
                </div>
                <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-red-500 text-white font-bold rounded-xl hover:from-blue-400 hover:to-red-400 transition text-lg">
                  Pay Now
                </button>
              </div>
            )}

            {activeNav === 'financial-statement' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Financial Statement</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Transaction Date</th>
                      <th className="text-left py-3 px-4">Reference Number</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-right py-3 px-4">Debit</th>
                      <th className="text-right py-3 px-4">Credit</th>
                      <th className="text-right py-3 px-4">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">2027-01-15</td>
                      <td className="py-3 px-4">TXN-001</td>
                      <td className="py-3 px-4">Term 1 Fees Invoice</td>
                      <td className="text-right py-3 px-4 text-red-400">335,000</td>
                      <td className="text-right py-3 px-4">-</td>
                      <td className="text-right py-3 px-4">335,000</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">2027-01-20</td>
                      <td className="py-3 px-4">TXN-002</td>
                      <td className="py-3 px-4">Uniform Fees Invoice</td>
                      <td className="text-right py-3 px-4 text-red-400">45,000</td>
                      <td className="text-right py-3 px-4">-</td>
                      <td className="text-right py-3 px-4">380,000</td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex gap-4 mt-6">
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-400/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition">
                    <FileText size={18} />
                    Download Statement
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-400 hover:bg-red-500/30 transition">
                    <FileText size={18} />
                    Print Statement
                  </button>
                </div>
              </div>
            )}

            {activeNav === 'registration-history' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Registration History</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Academic Year</th>
                      <th className="text-left py-3 px-4">Grade Level</th>
                      <th className="text-left py-3 px-4">Class</th>
                      <th className="text-left py-3 px-4">Registration Date</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">2027</td>
                      <td className="py-3 px-4">Grade 1</td>
                      <td className="py-3 px-4">1A</td>
                      <td className="py-3 px-4">2026-11-15</td>
                      <td className="text-center py-3 px-4"><span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">In Progress</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeNav === 'registration' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Registration</h2>
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-950/30 to-black/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Registration Status</h3>
                    <p className="text-yellow-400 font-semibold">In Progress</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-400" />
                      <span>Confirm Enrollment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-400" />
                      <span>Submit Required Documents</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-400" />
                      <span>Accept Terms and Conditions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-400" />
                      <span>Verify Student Information</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-yellow-400" />
                      <span>Complete Registration</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeNav === 'results' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Results</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Subject</th>
                      <th className="text-right py-3 px-4">Assessment</th>
                      <th className="text-right py-3 px-4">Examination</th>
                      <th className="text-right py-3 px-4">Average</th>
                      <th className="text-center py-3 px-4">Grade</th>
                      <th className="text-left py-3 px-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Mathematics</td>
                      <td className="text-right py-3 px-4">85</td>
                      <td className="text-right py-3 px-4">90</td>
                      <td className="text-right py-3 px-4">87.5</td>
                      <td className="text-center py-3 px-4"><span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">A</span></td>
                      <td className="py-3 px-4">Excellent</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">English</td>
                      <td className="text-right py-3 px-4">78</td>
                      <td className="text-right py-3 px-4">82</td>
                      <td className="text-right py-3 px-4">80</td>
                      <td className="text-center py-3 px-4"><span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">A</span></td>
                      <td className="py-3 px-4">Very Good</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Shona</td>
                      <td className="text-right py-3 px-4">72</td>
                      <td className="text-right py-3 px-4">75</td>
                      <td className="text-right py-3 px-4">73.5</td>
                      <td className="text-center py-3 px-4"><span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">B</span></td>
                      <td className="py-3 px-4">Good</td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex gap-4 mt-6">
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-400/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition">
                    <FileText size={18} />
                    Download Report Card
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-400 hover:bg-red-500/30 transition">
                    <FileText size={18} />
                    Print Academic Report
                  </button>
                </div>
              </div>
            )}

            {activeNav === 'assessment' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Assessment</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Assessment Title</th>
                      <th className="text-left py-3 px-4">Subject</th>
                      <th className="text-left py-3 px-4">Due Date</th>
                      <th className="text-right py-3 px-4">Marks Obtained</th>
                      <th className="text-right py-3 px-4">Total Marks</th>
                      <th className="text-left py-3 px-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Homework 1</td>
                      <td className="py-3 px-4">Mathematics</td>
                      <td className="py-3 px-4">2027-02-01</td>
                      <td className="text-right py-3 px-4">18</td>
                      <td className="text-right py-3 px-4">20</td>
                      <td className="py-3 px-4">Well done</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Project 1</td>
                      <td className="py-3 px-4">English</td>
                      <td className="py-3 px-4">2027-02-05</td>
                      <td className="text-right py-3 px-4">45</td>
                      <td className="text-right py-3 px-4">50</td>
                      <td className="py-3 px-4">Excellent work</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeNav === 'exam-timetable' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Exam Timetable</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Time</th>
                      <th className="text-left py-3 px-4">Subject</th>
                      <th className="text-left py-3 px-4">Venue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">2027-03-15</td>
                      <td className="py-3 px-4">09:00 - 11:00</td>
                      <td className="py-3 px-4">Mathematics</td>
                      <td className="py-3 px-4">Hall A</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">2027-03-16</td>
                      <td className="py-3 px-4">09:00 - 11:00</td>
                      <td className="py-3 px-4">English</td>
                      <td className="py-3 px-4">Hall B</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">2027-03-17</td>
                      <td className="py-3 px-4">09:00 - 11:00</td>
                      <td className="py-3 px-4">Shona</td>
                      <td className="py-3 px-4">Hall A</td>
                    </tr>
                  </tbody>
                </table>
                <button className="flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-400/30 rounded-xl text-green-400 hover:bg-green-500/30 transition mt-6">
                  <FileText size={18} />
                  Print Timetable
                </button>
              </div>
            )}

            {activeNav === 'change-password' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                <form className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-red-500 text-white font-bold rounded-xl hover:from-blue-400 hover:to-red-400 transition"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {activeNav === 'feedback' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Feedback</h2>
                <form className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Subject</label>
                    <input
                      type="text"
                      placeholder="Enter subject"
                      className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Message</label>
                    <textarea
                      rows={6}
                      placeholder="Enter your message, suggestion, complaint, or question"
                      className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-red-500 text-white font-bold rounded-xl hover:from-blue-400 hover:to-red-400 transition"
                  >
                    Submit Feedback
                  </button>
                </form>
              </div>
            )}

            {activeNav === 'profile' && (
              <div className="bg-gradient-to-br from-blue-950/20 to-black/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Student Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Admission Number</span>
                    <span className="font-semibold">AD-2027-001</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Student Number</span>
                    <span className="font-semibold">R216988M</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">First Name</span>
                    <span className="font-semibold">Mila</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Surname</span>
                    <span className="font-semibold">Doe</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Gender</span>
                    <span className="font-semibold">Male</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Date of Birth</span>
                    <span className="font-semibold">2015-03-15</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Grade Level</span>
                    <span className="font-semibold">Grade 1</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Class</span>
                    <span className="font-semibold">1A</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Mobile Number</span>
                    <span className="font-semibold">+263 71 234 5678</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Email Address</span>
                    <span className="font-semibold">mila.doe@example.com</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Physical Address</span>
                    <span className="font-semibold">123 Main St, Harare</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Guardian Name</span>
                    <span className="font-semibold">John Doe</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Guardian Contact</span>
                    <span className="font-semibold">+263 71 234 5679</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Registration Status</span>
                    <span className="font-semibold text-yellow-400">In Progress</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Admission Year</span>
                    <span className="font-semibold">2027</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Emergency Contact</span>
                    <span className="font-semibold">+263 71 234 5680</span>
                  </div>
                </div>
              </div>
            )}

            {activeNav !== 'profile' && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {navItems.find(item => item.id === activeNav)?.label}
                </h2>
                <p className="text-gray-400">This page is under development.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}