import React, { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { Plus, Trash2, Ticket, Loader2 } from 'lucide-react';
import { db } from '../firebase/firebase.config.js';

const EMPTY = { code: '', creditsValue: '' };

export default function CouponsManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCoupons(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.creditsValue) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'coupons'), {
        code: form.code.trim().toUpperCase(),
        creditsValue: Number(form.creditsValue),
        redeemed: false,
        createdAt: serverTimestamp(),
      });
      setForm(EMPTY);
    } finally {
      setSaving(false);
    }
  };

  const toggleRedeemed = async (coupon) => {
    await updateDoc(doc(db, 'coupons', coupon.id), { redeemed: !coupon.redeemed });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'coupons', id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-zinc-100">Cupones y bonos</h1>
        <p className="text-sm text-zinc-500">Códigos de campaña generados para los clientes.</p>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-base-900 border border-base-700 rounded-2xl p-4 shadow-panel flex flex-col sm:flex-row gap-3"
      >
        <input
          value={form.code}
          onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
          placeholder="Código (ej. PROMO5K)"
          className="flex-1 bg-base-850 border border-base-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/40 font-mono"
        />
        <input
          value={form.creditsValue}
          onChange={(e) => setForm((f) => ({ ...f, creditsValue: e.target.value }))}
          type="number"
          min="0"
          placeholder="Valor en créditos (ej. 5000)"
          className="sm:w-56 bg-base-850 border border-base-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-accent text-base-950 text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-accent/90 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Registrar
        </button>
      </form>

      <div className="bg-base-900 border border-base-700 rounded-2xl shadow-panel divide-y divide-base-700/60">
        {loading && <p className="px-5 py-6 text-sm text-zinc-600">Cargando cupones...</p>}

        {!loading && coupons.length === 0 && (
          <p className="px-5 py-6 text-sm text-zinc-600">Aún no hay cupones registrados.</p>
        )}

        {coupons.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Ticket className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-sm text-zinc-200 truncate">{c.code}</p>
                <p className="text-xs text-zinc-500">{Number(c.creditsValue).toLocaleString('es-ES')} créditos</p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(c.redeemed)}
                  onChange={() => toggleRedeemed(c)}
                  className="h-4 w-4 rounded border-base-600 bg-base-850 text-accent focus:ring-accent/40"
                />
                {c.redeemed ? 'Canjeado' : 'Disponible'}
              </label>
              <button
                onClick={() => handleDelete(c.id)}
                className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                title="Eliminar cupón"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
