# Fenix Retail 2.0

Proyecto Expo/React Native + Supabase + Stripe.

## Tech Stack
- Expo / React Native (Web + Mobile)
- Supabase (Auth, DB, Functions)
- Stripe (Pagos)
- Tailwind (via NativeWind)

## Scripts
Ejecuta la app en modo desarrollo:
```
npm start
```
Luego selecciona plataforma (w, a, i, etc.).

## Variables de Entorno
Crea un archivo `.env` basado en `.env.example` (no se sube a git).

## Estructura rápida
- `components/` componentes reutilizables
- `screens/` pantallas principales
- `lib/` clientes y configuración (Supabase)
- `supabase/functions/` Edge Functions
- `supabase/schema/` SQL de migraciones / schema

## Deploy / Publicación
1. Crear repo en tu cuenta GitHub y actualizar `origin`.
2. Push de la rama actual.
3. Configurar secrets (Stripe keys, Supabase keys) en variables de entorno/CI.

## Licencia
Indica la licencia aquí (MIT, Apache-2.0, etc.).
