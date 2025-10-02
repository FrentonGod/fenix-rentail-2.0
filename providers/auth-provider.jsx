import { AuthContext } from '../hooks/use-auth-context';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export default function AuthProvider({ children }) {
  const [session, setSession] = useState();
  const [profile, setProfile] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    const { data: listener } = supabase.auth.onAuthStateChange((event, sess) => {
      if (!mounted) return;
      setSession(sess);
      // La primera vez que arranca (o tras refresh) recibimos INITIAL_SESSION con lo que haya en storage
      if (event === 'INITIAL_SESSION') {
        setIsLoading(false);
      }
      if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });
    // Fallback: si por alguna razón no llega INITIAL_SESSION en ~1s, forzamos un getSession
    const t = setTimeout(async () => {
      if (!mounted) return;
      if (isLoading) {
        const { data } = await supabase.auth.getSession();
        setSession(data?.session ?? null);
        setIsLoading(false);
      }
    }, 1000);
    return () => {
      mounted = false;
      clearTimeout(t);
      listener.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    try {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        if (error) console.error('Error fetching profile:', error);
        setProfile(data ?? null);
      } else {
        setProfile(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  return (
    <AuthContext.Provider value={{ session, profile, isLoading, isLoggedIn: !!session, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
