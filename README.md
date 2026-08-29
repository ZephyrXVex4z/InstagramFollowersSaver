# Vault — Panel de Perfiles (Agencia)

Panel privado en React + Tailwind + Firebase (Auth + Firestore en tiempo real) para
administrar los perfiles de redes sociales de clientes.

## 1. Instalación

```bash
npm install
npm run dev
```

## 2. Configura Firebase

1. En la consola de Firebase, ve a **Authentication → Sign-in method** y activa
   **Correo/Contraseña**.
2. En **Authentication → Users**, crea manualmente el usuario administrador
   (correo + contraseña). Esta app no tiene registro público a propósito.
3. En **Firestore Database**, crea la base de datos (modo producción).
4. Despliega las reglas incluidas en `firestore.rules`:

   ```bash
   firebase deploy --only firestore:rules
   ```

5. (Recomendado) Activa **App Check** en el proyecto para que solo tu dominio
   de Hosting pueda leer/escribir en Firestore.

## 3. Despliegue

```bash
npm run build
firebase deploy --only hosting
```

## 4. Estructura

```
src/
  firebase/firebase.config.js   -> Única fuente de inicialización de Firebase
  hooks/useAuth.js              -> Estado de sesión (onAuthStateChanged)
  components/
    Login.jsx                   -> Pantalla de acceso
    Sidebar.jsx                 -> Navegación lateral (responsive)
    MetricCards.jsx             -> Tarjetas de resumen
    AlertsPanel.jsx             -> Cambios de estado recientes (48h)
    ProfilesManager.jsx         -> Tabla CRUD con onSnapshot + búsqueda/filtro
    ProfileFormModal.jsx        -> Alta/edición de perfil
    CouponsManager.jsx          -> Cupones/créditos de campaña
    statusMeta.js                -> Colores/labels de estado compartidos
  App.jsx                       -> Enrutado por estado + protección de sesión
firestore.rules                 -> Reglas de seguridad (obligatorias)
```

## 5. Nota importante sobre seguridad

Este panel guarda **contraseñas en texto plano** dentro de Firestore
(contraseña de correo y de la cuenta social), tal como se pidió. Antes de
usarlo con datos reales de clientes, ten en cuenta:

- **`firestore.rules` es obligatorio.** Sin reglas correctas, cualquiera con
  el `projectId` (que es público) podría leer todas las contraseñas
  guardadas. Las reglas incluidas exigen sesión autenticada para cualquier
  lectura o escritura.
- **Un solo punto de fuga = todas las credenciales expuestas.** Si el
  dispositivo del admin, la sesión del navegador, o la cuenta de Firebase se
  ven comprometidos, todas las contraseñas quedan expuestas de una sola vez,
  a diferencia de un gestor de contraseñas dedicado (1Password, Bitwarden)
  que cifra cada entrada de extremo a extremo.
- **Recomendación real:** si es posible, evita guardar la contraseña del
  cliente y usa en su lugar acceso delegado oficial (Meta Business Suite /
  Business Manager, TikTok Business Center, etc.), donde el cliente te da
  permisos de gestión sin compartir su contraseña. Cuando eso no sea viable,
  considera cifrar los campos de contraseña con una Cloud Function (por
  ejemplo, usando `libsodium` o el Secret Manager de Google Cloud) en vez de
  guardarlos en claro, para que ni siquiera alguien con acceso directo a la
  base de datos pueda leerlos sin la clave de cifrado.
- Activa la verificación en dos pasos en la cuenta de Firebase/Google del
  administrador.

## 6. Corrección aplicada

El `authDomain` que compartiste (`://firebaseapp.com`) estaba incompleto; se
corrigió a `instagram-followers-market.firebaseapp.com` (el formato estándar
`{projectId}.firebaseapp.com`), o de lo contrario `signInWithEmailAndPassword`
fallaría.
