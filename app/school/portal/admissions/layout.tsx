'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home, User, Edit, CheckCircle, CreditCard,
  Mail, LogOut, Menu, ChevronRight, Sparkles
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard',        icon: Home,        href: '/school/portal/admissions/dashboard' },
  { id: 'profile',   label: 'Student Profile',  icon: User,        href: '/school/portal/admissions/profile' },
  { id: 'edit',      label: 'Edit Profile',     icon: Edit,        href: '/school/portal/admissions/edit-profile' },
  { id: 'admission', label: 'Admissions Status',icon: CheckCircle, href: '/school/portal/admissions/application-status' },
  { id: 'payments',  label: 'Online Payments',  icon: CreditCard,  href: '/school/portal/admissions/payments' },
  { id: 'feedback',  label: 'Feedback',         icon: Mail,        href: '/school/portal/admissions/feedback' },
];

export default function AdmissionsLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]             = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed]   = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('portalUser');
    if (!stored) { router.push('/school/portal'); return; }
    const parsed = JSON.parse(stored);
    if (parsed.portalType !== 'admissions') { router.push('/school/portal'); return; }
    setUser(parsed);
  }, [router]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node))
        setMobileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem('portalUser');
    router.push('/school/portal');
  };

  const activeItem = menuItems.find(m => m.href === pathname);
  const initials   = `${user?.firstname?.[0] ?? ''}${user?.lastname?.[0] ?? ''}`.toUpperCase();

  if (!user) return (
    <div className="loading-screen">
      <div className="ring" />
      <style jsx>{`.loading-screen{display:flex;align-items:center;justify-content:center;height:100vh;background:#f8f9fc}.ring{width:36px;height:36px;border:3px solid #e0e7f0;border-top-color:#0b2d6b;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className={`root ${collapsed ? 'collapsed' : ''}`}>
      {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)} />}

      <header className="mob-header">
        <button className="icon-btn" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
        <span className="mob-brand">MIRA · Admissions</span>
        <div className="avatar sm">{initials}</div>
      </header>

      <aside ref={sidebarRef} className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="logo-box">
            <Image src="/images/slo.png" alt="MGPS" width={32} height={32} />
          </div>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-name">MIRA</span>
              <span className="brand-sub">Admissions Portal</span>
            </div>
          )}
          <button className="collapse-btn d-only" onClick={() => setCollapsed(v => !v)}>
            <ChevronRight size={14} style={{ transform: collapsed ? 'rotate(0)' : 'rotate(180deg)', transition: 'transform .3s' }} />
          </button>
        </div>

        <div className="user-card">
          <div className="avatar">{initials}</div>
          {!collapsed && (
            <div className="u-info">
              <p className="u-name">{user.firstname} {user.lastname}</p>
              <p className="u-role">Admissions Applicant</p>
            </div>
          )}
        </div>

        <nav className="nav">
          {menuItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`nav-link ${active ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
              >
                <span className="n-icon"><item.icon size={17} /></span>
                {!collapsed && <span className="n-label">{item.label}</span>}
                {!collapsed && active && <span className="dot" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-foot">
          <Link href="/school" className="foot-link" title="MGPS Website">
            <Home size={15} />{!collapsed && <span>MGPS Website</span>}
          </Link>
          <button onClick={handleLogout} className="foot-btn" title="Log out">
            <LogOut size={15} />{!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="bc">
            <span className="bc-root">Admissions Portal</span>
            {activeItem && <><ChevronRight size={13} className="bc-sep" /><span className="bc-cur">{activeItem.label}</span></>}
          </div>
          <div className="topbar-r">
            <Sparkles size={14} style={{ color: '#f5a623' }} />
            <span className="greeting">Hi, {user.firstname}</span>
          </div>
        </div>
        <div className="content">{children}</div>
      </main>

      <style jsx>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .root{display:flex;min-height:100vh;background:#f0f3f8;--w:240px;--cw:64px;--blue:#0b2d6b;--accent:#c5252b;--gold:#f5a623;--t:.22s cubic-bezier(.4,0,.2,1);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
        .overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:99;backdrop-filter:blur(2px);animation:fi .2s ease}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        .mob-header{display:none;position:fixed;top:0;left:0;right:0;height:56px;background:var(--blue);align-items:center;justify-content:space-between;padding:0 16px;z-index:98}
        .mob-brand{color:white;font-weight:700;font-size:.9rem;letter-spacing:.04em}
        .icon-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;background:rgba(255,255,255,.12);color:white;border-radius:8px;cursor:pointer;transition:background var(--t)}
        .icon-btn:hover{background:rgba(255,255,255,.2)}
        .avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--accent));color:white;font-size:.72rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .avatar.sm{width:28px;height:28px;font-size:.62rem}
        .sidebar{width:var(--w);background:var(--blue);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;overflow:hidden auto;z-index:100;transition:width var(--t);scrollbar-width:none}
        .sidebar::-webkit-scrollbar{display:none}
        .collapsed .sidebar{width:var(--cw)}
        .brand{display:flex;align-items:center;gap:10px;padding:18px 14px 14px;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0}
        .logo-box{width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}
        .brand-text{overflow:hidden}
        .brand-name{display:block;font-size:.88rem;font-weight:800;color:white;letter-spacing:.1em}
        .brand-sub{font-size:.58rem;color:rgba(255,255,255,.4);letter-spacing:.05em}
        .collapse-btn{margin-left:auto;width:24px;height:24px;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:transparent;color:rgba(255,255,255,.5);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:background var(--t)}
        .collapse-btn:hover{background:rgba(255,255,255,.12);color:white}
        .d-only{display:flex}
        .user-card{display:flex;align-items:center;gap:10px;padding:12px;margin:10px;background:rgba(255,255,255,.07);border-radius:12px;border:1px solid rgba(255,255,255,.08);overflow:hidden}
        .u-info{overflow:hidden}
        .u-name{font-size:.78rem;font-weight:600;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .u-role{font-size:.62rem;color:rgba(255,255,255,.4);margin-top:1px}
        .nav{flex:1;padding:8px 0;overflow-y:auto;scrollbar-width:none}
        .nav::-webkit-scrollbar{display:none}
        .nav-link{display:flex;align-items:center;gap:10px;padding:10px 14px;margin:2px 8px;color:rgba(255,255,255,.65);text-decoration:none;font-size:.8rem;font-weight:500;border-radius:8px;transition:all var(--t);white-space:nowrap;overflow:hidden;position:relative}
        .nav-link:hover{background:rgba(255,255,255,.1);color:white;transform:translateX(2px)}
        .nav-link.active{background:var(--accent);color:white;box-shadow:0 4px 12px rgba(197,37,43,.3)}
        .n-icon{display:flex;align-items:center;justify-content:center;flex-shrink:0;width:20px}
        .dot{width:5px;height:5px;background:var(--gold);border-radius:50%;margin-left:auto;flex-shrink:0;animation:pulse 2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.7)}}
        .sidebar-foot{padding:10px;border-top:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:4px;flex-shrink:0}
        .foot-link,.foot-btn{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:7px;font-size:.78rem;font-weight:500;cursor:pointer;transition:all var(--t);text-decoration:none;border:none;width:100%;white-space:nowrap;overflow:hidden}
        .foot-link{color:rgba(255,255,255,.55);background:transparent}
        .foot-link:hover{background:rgba(255,255,255,.08);color:white}
        .foot-btn{color:rgba(255,255,255,.55);background:transparent;justify-content:flex-start}
        .foot-btn:hover{background:rgba(197,37,43,.2);color:#ff8888}
        .main{flex:1;margin-left:var(--w);display:flex;flex-direction:column;min-height:100vh;transition:margin-left var(--t)}
        .collapsed .main{margin-left:var(--cw)}
        .topbar{display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:54px;background:white;border-bottom:1px solid #e8ecf4;position:sticky;top:0;z-index:10}
        .bc{display:flex;align-items:center;gap:6px;font-size:.78rem}
        .bc-root{color:#94a3b8}.bc-sep{color:#cbd5e1}.bc-cur{color:var(--blue);font-weight:600}
        .topbar-r{display:flex;align-items:center;gap:7px;font-size:.78rem;font-weight:500;color:var(--blue)}
        .content{flex:1;padding:28px 24px;animation:cu .3s ease}
        @keyframes cu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:768px){
          .mob-header{display:flex}.overlay{display:block}.d-only{display:none}
          .sidebar{width:var(--w)!important;transform:translateX(-100%);transition:transform var(--t)}
          .sidebar.open{transform:translateX(0);box-shadow:4px 0 32px rgba(0,0,0,.25)}
          .main{margin-left:0!important}.content{padding-top:80px;padding-left:16px;padding-right:16px}
        }
      `}</style>
    </div>
  );
}