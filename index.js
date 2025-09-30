import { registerRootComponent } from 'expo';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import App from './App';
import AuthProvider from './providers/auth-provider';
import { SplashScreenController } from './components/splash-screen-controller';
import LoginScreen from './screens/Login';
import PreRegistroScreen from './screens/PreRegistro';
import RegisterScreen from './screens/Register';
import { useAuthContext } from './hooks/use-auth-context';

const Stack = createNativeStackNavigator();

const NAV_STATE_KEY = 'NAVIGATION_STATE_V1';

function RootNavigator() {
	const { isLoggedIn, profile, isLoading } = useAuthContext();
	// Espera a que cargue la sesión/perfil para evitar parpadeo a Login en cada refresh
	if (isLoading) return null; // Splash sigue visible por SplashScreenController
	const needsPreRegistro = isLoggedIn && (!profile || !profile?.full_name);
	return (
		<NavigationContainer
			onStateChange={(state) => AsyncStorage.setItem(NAV_STATE_KEY, JSON.stringify(state)).catch(() => {})}
			initialState={undefined}
		>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{!isLoggedIn ? (
					<>
						<Stack.Screen name="Login" component={LoginScreen} />
						<Stack.Screen name="Register" component={RegisterScreen} />
					</>
				) : needsPreRegistro ? (
					<Stack.Screen name="PreRegistro" component={PreRegistroScreen} />
				) : (
					<Stack.Screen name="Main" component={App} />
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}

function Root() {
	return (
		<AuthProvider>
			<SplashScreenController />
			<RootNavigator />
		</AuthProvider>
	);
}

registerRootComponent(Root);