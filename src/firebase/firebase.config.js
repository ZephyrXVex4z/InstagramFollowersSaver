// src/firebase/firebase.config.js
//
// Inicialización central de Firebase (SDK modular v9/v10).
// Todos los componentes deben importar `auth` y `db` desde aquí,
// nunca inicializar la app en más de un lugar.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// NOTA DE SEGURIDAD:
// La apiKey de un proyecto web de Firebase no es un secreto: identifica
// el proyecto, no autoriza operaciones. La seguridad real de esta app
// depende de dos cosas que están FUERA de este archivo:
//   1. Las reglas de Firestore (ver firestore.rules) — deben exigir
//      request.auth != null para leer/escribir cualquier colección.
//   2. Tener Firebase App Check activado en producción para evitar
//      que alguien llame a tu proyecto desde fuera de tu dominio.
const firebaseConfig = {
  apiKey: 'AIzaSyBuXy_D4HqGYJS2UnnwKSV13KlsH7nQRiU',
  authDomain: 'instagram-followers-market.firebaseapp.com',
  projectId: 'instagram-followers-market',
  storageBucket: 'instagram-followers-market.firebasestorage.app',
  messagingSenderId: '623895572344',
  appId: '1:623895572344:web:775b1ec052f0fc5ff9e28d',
  measurementId: 'G-ZV0CGNX21F',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
