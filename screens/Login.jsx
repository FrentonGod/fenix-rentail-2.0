import { View, Text, TextInput, Pressable, Platform, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import ConstellationBackground from '../components/backgrounds/ConstellationBackground';
import { supabase } from '../lib/supabase';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const bpSmall = 640;   
  const bpMedium = 900;  
  const isSmall = width < bpSmall;
  const isTablet = width >= bpSmall && width < bpMedium;
  const isLarge = width >= bpMedium;
  const showHeroArt = width >= 600; 
  const cardMaxWidth = Math.min(720, Math.max(520, Math.round(width * (isLarge ? 0.66 : isTablet ? 0.76 : 0.92))));
  const variant = (process.env.EXPO_PUBLIC_LOGIN_VARIANT || 'classic').toLowerCase();
  const redirectTo = (Platform.OS === 'web' && typeof window !== 'undefined')
    ? window.location.origin
    : Linking.createURL('/');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwdFocused, setPwdFocused] = useState(false);
  const allowedDomains = (process.env.EXPO_PUBLIC_AUTH_ALLOWED_DOMAINS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const allowedEmails = (process.env.EXPO_PUBLIC_AUTH_ALLOWED_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const emailAllowed = (value) => {
    if (!value) return false;
    const lower = value.toLowerCase();
    if (allowedEmails.length > 0) return allowedEmails.includes(lower);
    if (allowedDomains.length === 0) return true; 
    const domain = value.split('@')[1]?.toLowerCase();
    return !!domain && allowedDomains.includes(domain);
  };

  const onPasswordLogin = async () => {
    setErrorMsg('');
    setNeedsVerification(false);
    if (!email) return setErrorMsg('Ingresa tu correo.');
    if (!password) return setErrorMsg('Ingresa tu contraseña.');
    if (!emailAllowed(email)) return setErrorMsg('Este correo no está autorizado.');
    try {
      setSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = String(error.message || '').toLowerCase();
        if (msg.includes('invalid login credentials')) {
          setErrorMsg('Correo o contraseña inválidos.');
        } else if (msg.includes('email not confirmed') || msg.includes('confirm')) {
          setErrorMsg('Debes confirmar tu correo antes de iniciar sesión.');
          setNeedsVerification(true);
        } else {
          setErrorMsg('No fue posible iniciar sesión.');
        }
        console.error('Password sign-in error:', error);
      }
      // Si no hay error, la sesión se establece y el RootNavigator redirige.
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    setErrorMsg('');
    if (!email) return setErrorMsg('Ingresa tu correo para reenviar.');
    try {
      setResending(true);
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) {
        const msg = String(error.message || '').toLowerCase();
        if (error.status === 429 || msg.includes('retry')) {
          setErrorMsg('Demasiados intentos. Reintenta en unos segundos.');
        } else {
          setErrorMsg('No se pudo reenviar el correo.');
        }
        console.error('Resend verification error:', error);
      } else {
        setErrorMsg('Correo de verificación reenviado. Revisa tu bandeja y spam.');
      }
    } finally {
      setResending(false);
    }
  };

  const onResetPassword = async () => {
    setErrorMsg('');
    if (!email) return setErrorMsg('Ingresa tu correo para recuperar tu contraseña.');
    try {
      setSubmitting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) {
        setErrorMsg('No se pudo enviar el correo de recuperación.');
        console.error('Reset password error:', error);
      } else {
        setErrorMsg('Te enviamos un correo para restablecer tu contraseña.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onGooglePress = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: false,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) console.error('Google sign-in error:', error);
    else if (data?.url) Linking.openURL(data.url);
  };

  const onApplePress = async () => {
    const serviceId = process.env.EXPO_PUBLIC_APPLE_AUTH_SERVICE_ID;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo,
        queryParams: serviceId
          ? { response_type: 'code', response_mode: 'form_post' }
          : undefined,
      },
    });
    if (error) console.error('Apple sign-in error:', error);
    else if (data?.url) Linking.openURL(data.url);
  };
  

  return (
    <View className="flex-1 bg-slate-50">
      <HeaderAdmin
        logoSource={require('../assets/MQerK_logo.png')}
        onLogoPress={() => {}}
        title="MQerK Academy"
        showActions={false}
        sizeVariant="loginXL"
      />
      <View className="flex-1 px-4 py-6 items-center justify-center">
        {/* Título principal fuera del header */}
        <View
          style={{
            width: '100%',
            maxWidth: cardMaxWidth,
            marginBottom: 16,
            marginTop: isLarge ? 16 : isTablet ? 14 : 10,
          }}
          className="items-center"
        >
          <Text
            className="text-slate-900 font-extrabold text-center"
            style={{
              fontSize: isLarge ? 32 : isTablet ? 28 : 22,
              letterSpacing: 0.3,
            }}
          >
            Bienvenido al punto de venta
          </Text>
          <LinearGradient
            colors={[ '#7C3AED', '#6F09EA' ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 4, width: isLarge ? 360 : isTablet ? 300 : 220, borderRadius: 9999, marginTop: 8, opacity: 0.9 }}
          />
        </View>
        {/* Fondo sutil con gradiente */}
        <LinearGradient
          colors={[ 'rgba(111,9,234,0.06)', 'rgba(111,9,234,0.00)' ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        />
        {/* Fondo animado ligero */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
          <ConstellationBackground width={width} height={height} color="#6F09EA" />
        </View>

        {/* Card con borde de gradiente */}
        <LinearGradient
          colors={[ '#7C3AED', '#6F09EA' ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 24, padding: 2, width: '100%', maxWidth: cardMaxWidth }}
        >
          <View className="bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Header compacto con logo + tagline */}
            <LinearGradient
              colors={["#6F09EA", "#7009E8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: '100%',
                paddingVertical: showHeroArt ? 28 : 20,
                paddingTop: isLarge ? 28 : isTablet ? 24 : 20,
                paddingHorizontal: 16,
              }}
            >
              {showHeroArt ? (
                <View className="w-full items-center justify-center">
                  <View className="flex-row items-center gap-x-3">
                    <Image source={require('../assets/MQerK_logo.png')} style={{ width: 84, height: 84 }} resizeMode="contain" />
                    <View>
                      <Text className="text-white font-extrabold" style={{ fontSize: 24 }}>MQerK Academy</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View className="items-center justify-center">
                  <Image source={require('../assets/MQerK_logo.png')} style={{ width: 120, height: 120 }} resizeMode="contain" />
                </View>
              )}
            </LinearGradient>

            {/* Cuerpo del formulario */}
            <View className="p-7">
              <Text className="text-slate-900 font-extrabold mb-1 text-center" style={{ fontSize: isLarge ? 30 : isTablet ? 28 : 24 }}>Iniciar sesión</Text>
              <Text className="text-slate-500 text-center mb-5">Accede a tu cuenta para continuar</Text>
              <View className="gap-y-3">
                <Text className="text-slate-800 font-bold">Correo</Text>
                <View className="relative">
                  <View className="absolute left-3 top-1/2 -translate-y-1/2" pointerEvents="none">
                      <Svg width={18} height={18} viewBox="0 -960 960 960" fill="#64748b"><Path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm320-260L160-640v360h640v-360L480-460Zm0-60 320-180H160l320 180Z"/></Svg>
                  </View>
                  <TextInput
                    placeholder="tucorreo@dominio.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    className={`bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900`}
                    onFocus={() => { if (Platform.OS !== 'web') setEmailFocused(true); }}
                    onBlur={() => { if (Platform.OS !== 'web') setEmailFocused(false); }}
                    style={[{ height: 48 }, Platform.OS !== 'web' && emailFocused ? { borderColor: '#6F09EA' } : null]}
                    autoCorrect={false}
                    importantForAutofill="yes"
                    textContentType={Platform.OS === 'ios' ? 'emailAddress' : undefined}
                    autoComplete="email"
                    blurOnSubmit={false}
                    placeholderTextColor="#9ca3af"
                    onKeyPress={(e) => {
                      if (Platform.OS === 'web' && e?.nativeEvent?.key === 'Enter') {
                        e.preventDefault?.();
                      }
                    }}
                    value={email}
                  />
                </View>

                <Text className="text-slate-800 font-bold">Contraseña</Text>
                <View className="relative">
                  <View className="absolute left-3 top-1/2 -translate-y-1/2" pointerEvents="none">
                      <Svg width={18} height={18} viewBox="0 -960 960 960" fill="#64748b"><Path d="M240-440v-200q0-100 70-170t170-70q100 0 170 70t70 170v200h40q33 0 56.5 23.5T840-360v280q0 33-23.5 56.5T760-0H200q-33 0-56.5-23.5T120-80v-280q0-33 23.5-56.5T200-440h40Zm80 0h320v-200q0-67-46.5-113.5T480-800q-67 0-113.5 46.5T320-640v200Z"/></Svg>
                  </View>
                  <TextInput
                    placeholder="Tu contraseña"
                    autoCapitalize="none"
                    secureTextEntry={!showPwd}
                    onChangeText={setPassword}
                    className={`bg-white border border-slate-300 rounded-xl pl-10 pr-12 py-3 text-slate-900`}
                    onFocus={() => { if (Platform.OS !== 'web') setPwdFocused(true); }}
                    onBlur={() => { if (Platform.OS !== 'web') setPwdFocused(false); }}
                    style={[{ height: 48 }, Platform.OS !== 'web' ? { zIndex: 1 } : null, Platform.OS !== 'web' && pwdFocused ? { borderColor: '#6F09EA' } : null]}
                    autoCorrect={false}
                    importantForAutofill="yes"
                    textContentType={Platform.OS === 'ios' ? 'password' : undefined}
                    autoComplete="current-password"
                    blurOnSubmit={false}
                    placeholderTextColor="#9ca3af"
                    onKeyPress={(e) => {
                      if (Platform.OS === 'web' && e?.nativeEvent?.key === 'Enter') {
                        e.preventDefault?.();
                      }
                    }}
                    value={password}
                  />
                  <Pressable
                    onPress={() => setShowPwd((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full items-center justify-center bg-white/70 border border-slate-300 shadow-sm active:opacity-80"
                    hitSlop={10}
                    accessibilityLabel={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
                  >
                    {showPwd ? (
                      // Eye (visible)
                      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" stroke="#475569" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="#475569" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    ) : (
                      // Eye off (hidden)
                      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" stroke="#475569" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        <Path d="M3 3l18 18" stroke="#475569" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    )}
                  </Pressable>
                </View>

                <View className="flex-row items-center justify-between mt-1">
                  <Pressable onPress={onResetPassword} disabled={submitting} hitSlop={8} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
                    <Text className="text-[#6F09EA] font-bold">¿Olvidaste tu contraseña?</Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={onPasswordLogin}
                  disabled={submitting}
                  className="mt-3 rounded-xl"
                  hitSlop={10}
                  android_ripple={{ color: 'rgba(255,255,255,0.15)', borderless: false }}
                  style={Platform.OS === 'web' ? { cursor: submitting ? 'not-allowed' : 'pointer', borderRadius: 12 } : { borderRadius: 12 }}
                >
                  <LinearGradient
                    colors={submitting ? ['#9F7AEA', '#9F7AEA'] : ['#6F09EA', '#7009E8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ borderRadius: 12, paddingVertical: 16, alignItems: 'center' }}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-white font-bold text-[16px]">Iniciar sesión</Text>
                    )}
                  </LinearGradient>
                </Pressable>

                {!!errorMsg && (
                  <Text className="text-red-600 text-sm mt-1">{errorMsg}</Text>
                )}
                {needsVerification && (
                  <View className="mt-2 items-start">
                    <Pressable onPress={onResend} disabled={resending} hitSlop={8} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
                      <Text className={`font-bold ${resending ? 'text-slate-400' : 'text-[#6F09EA]'}`}>
                        {resending ? 'Reenviando…' : 'Reenviar verificación'}
                      </Text>
                    </Pressable>
                  </View>
                )}
                {allowedDomains.length > 0 && (
                  <Text className="text-slate-500 text-xs">Solo se permiten correos de: {allowedDomains.join(', ')}</Text>
                )}
              </View>

              <View className="mt-6 items-center">
                <Text className="text-slate-600">
                  ¿No tienes cuenta?{' '}
                  <Text className="text-[#6F09EA] font-bold" onPress={() => navigation?.navigate('Register')}>
                    Regístrate
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}
