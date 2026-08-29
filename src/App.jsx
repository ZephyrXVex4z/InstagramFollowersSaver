import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Menu } from 'lucide-react';
import { db } from './firebase/firebase.config.js';
import { useAuth } from './hooks/useAuth.js';
import Login from './components/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import MetricCards from './components/MetricCards.jsx';
import AlertsPanel from './components/AlertsPanel.jsx';
import ProfilesManager from './components/ProfilesManager.jsx';
import CouponsManager from './components/CouponsManager.jsx';

export default function App() {
  const { user, checkingAuth, authError, login, logout } = useAuth();
  const [view, setView] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profiles, setProfiles] = useState([]);

  // Feed compartido de perfiles en tiempo real para el resumen general.
  // (El Gestor de Perfiles mantiene su propio listener con filtros/orden.)
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, 'profiles'), (snapshot) => {
      setProfiles(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-base-950 flex items-center justify-center text-zinc-600 text-sm">
        Verificando sesión...
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={login} authError={authError} />;
  }

  return (
    <div className="min-h-screen bg-base-950 flex">
      <Sidebar
        active={view}
        onNavigate={(v) => {
          setView(v);
          setMobileNavOpen(false);
        }}
        onLogout={logout}
        user={user}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-base-700 flex items-center px-4 lg:px-6 sticky top-0 bg-base-950/80 backdrop-blur z-20">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden text-zinc-400 mr-3"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
            {view === 'overview' && 'Resumen'}
            {view === 'profiles' && 'Gestor de perfiles'}
            {view === 'coupons' && 'Cupones y bonos'}
          </span>
        </header>

        <main className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto">
          {view === 'overview' && (
            <>
              <div>
                <h1 className="text-lg font-semibold text-zinc-100">Resumen general</h1>
                <p className="text-sm text-zinc-500">Estado actual de la cartera de perfiles.</p>
              </div>
              <MetricCards profiles={profiles} />
              <AlertsPanel profiles={profiles} />
            </>
          )}

          {view === 'profiles' && <ProfilesManager />}
          {view === 'coupons' && <CouponsManager />}
        </main>
      </div>
    </div>
  );
}
