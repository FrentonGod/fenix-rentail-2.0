# Supabase Social Auth Setup (Expo)

1) Fill `.env` with values:
   - EXPO_PUBLIC_SUPABASE_URL
   - EXPO_PUBLIC_SUPABASE_ANON_KEY
   - EXPO_PUBLIC_APPLE_AUTH_SERVICE_ID (if using Apple via Service ID)
   - EXPO_PUBLIC_APPLE_AUTH_REDIRECT_URI (e.g. fenixrentail://)

2) In Supabase Auth Settings:
   - Add Redirect URL(s) used during development, including expo tunnel URL and scheme-based deep link (fenixrentail://).

3) Start the app:
   - npx expo start --tunnel

4) For Android/Web Apple sign-in, register the tunnel URL in Apple and Supabase.