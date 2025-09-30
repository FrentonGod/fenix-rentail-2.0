import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthContext } from '../hooks/use-auth-context';

SplashScreen.preventAutoHideAsync().catch(() => {});

export function SplashScreenController() {
  const { isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoading]);

  return null;
}
