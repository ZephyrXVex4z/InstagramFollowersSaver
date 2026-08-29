import React, { useEffect, useMemo, useState } from 'react';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
  query,
} from 'firebase/firestore';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';
import { db } from '../firebase/firebase.config.js';
import { STATUS_META } from './statusMeta.js';
import ProfileFormModal from './ProfileFormModal.jsx';

function SecretCell({ value }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard no disponible, se ignora silenciosamente */
    }
  };

  return (
    <div className="flex items-center gap-1.5 font-mono text-xs">
      <span className="text-zinc-300 truncate max-w-[110px]">
        {visible ? value || '—' : '•'.repeat(Math.min(value?.length || 6, 10))}
      </span>
      <button
        onClick={() => setVisible((v) => !v)}
        className="text-zinc-600 hover:text-zinc-300"
        title={visible ? 'Ocultar' : 'Mostrar'}
      >
        {visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      </button>
      <button
        onClick={handleCopy}
        className="text-zinc-600 hover:text-zinc-300"
        title="Copiar"
      >
        {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
      </button>
    </div>
  );
}

export default function ProfilesManager() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Listener en tiempo real: cualquier cambio en Firestore se refleja
  // aquí sin recargar la página.
  useEffect(() => {
    const q = query(collection(db, 'profiles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setProfiles(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('Error escuchando perfiles:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const haystack = `${p.socialUsername ?? ''} ${p.clientName ?? ''} ${p.recoveryEmail ?? ''}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [profiles, search, statusFilter]);

  const handleStatusChange = async (profile, newStatus) => {
    if (newStatus === profile.status) return;
    await updateDoc(doc(db, 'profiles', profile.id), {
      status: newStatus,
      statusChangedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'profiles', id));
    setDeletingId(null);
  };

  const openAddModal = () => {
    setEditingProfile(null);
    setModalOpen(true);
  };

  const openEditModal = (profile) => {
    setEditingProfile(profile);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Gestor de perfiles</h1>
          <p className="text-sm text-zinc-500">
            {filtered.length} de {profiles.length} perfiles
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-accent text-base-950 text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Añadir perfil
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por usuario, cliente o correo..."
            className="w-full bg-base-900 border border-base-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-base-900 border border-base-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activo/Verificado</option>
          <option value="review">En Pausa/Revisión</option>
          <option value="blocked">Desconectado/Bloqueado</option>
        </select>
      </div>

      <div className="bg-base-900 border border-base-700 rounded-2xl shadow-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-base-700 text-left">
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase whitespace-nowrap">Cliente / Usuario</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase whitespace-nowrap">Correo recuperación</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase whitespace-nowrap">Contraseña correo</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase whitespace-nowrap">Contraseña cuenta</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase whitespace-nowrap">Estación</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase whitespace-nowrap">Proxy / IP</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase whitespace-nowrap">Estado</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase whitespace-nowrap">Alta</th>
                <th className="px-4 py-3 font-medium text-zinc-500 text-xs uppercase whitespace-nowrap text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-700/60">
              {loading && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-zinc-600">
                    Cargando perfiles...
                  </td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-zinc-600">
                    No hay perfiles que coincidan con la búsqueda.
                  </td>
                </tr>
              )}

              {filtered.map((p) => {
                const meta = STATUS_META[p.status] ?? STATUS_META.review;
                return (
                  <tr key={p.id} className="hover:bg-base-850/60">
                    <td className="px-4 py-3">
                      <p className="text-zinc-200 font-medium">@{p.socialUsername || '—'}</p>
                      <p className="text-xs text-zinc-600">{p.clientName || 'Sin cliente asignado'}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">{p.recoveryEmail || '—'}</td>
                    <td className="px-4 py-3"><SecretCell value={p.recoveryEmailPassword} /></td>
                    <td className="px-4 py-3"><SecretCell value={p.socialPassword} /></td>
                    <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">{p.station || '—'}</td>
                    <td className="px-4 py-3 text-xs text-zinc-400 font-mono whitespace-nowrap">{p.proxyIp || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2.5 py-1 border bg-transparent focus:outline-none ${meta.badge}`}
                      >
                        <option className="bg-base-900 text-emerald-400" value="active">Activo/Verificado</option>
                        <option className="bg-base-900 text-amber-400" value="review">En Pausa/Revisión</option>
                        <option className="bg-base-900 text-red-400" value="blocked">Desconectado/Bloqueado</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">
                      {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString('es-ES') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-md text-zinc-500 hover:text-accent hover:bg-accent/10"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(p.id)}
                          className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ProfileFormModal
          initialProfile={editingProfile}
          onClose={() => setModalOpen(false)}
        />
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-base-900 border border-base-700 rounded-2xl p-6 max-w-sm w-full shadow-panel">
            <h3 className="text-zinc-100 font-semibold mb-1">Eliminar perfil</h3>
            <p className="text-sm text-zinc-500 mb-5">
              Esta acción no se puede deshacer. Se eliminarán las credenciales guardadas para este perfil.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-sm rounded-lg text-zinc-400 hover:text-zinc-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 text-sm rounded-lg bg-red-500/90 text-white hover:bg-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
