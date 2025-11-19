import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  useWindowDimensions,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase";
import HeaderAdmin from "../components/HeaderAdmin";
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height && Platform.OS !== "web";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [resending, setResending] = useState(false);

  const allowedDomains = (process.env.EXPO_PUBLIC_AUTH_ALLOWED_DOMAINS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const allowedEmails = (process.env.EXPO_PUBLIC_AUTH_ALLOWED_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const emailAllowed = (value) => {
    if (!value) return false;
    const lower = value.toLowerCase();
    if (allowedEmails.length > 0) return allowedEmails.includes(lower);
    if (allowedDomains.length === 0) return true;
    const domain = value.split("@")[1]?.toLowerCase();
    return !!domain && allowedDomains.includes(domain);
  };

  const onRegister = async () => {
    setErrorMsg("");
    setInfoMsg("");
    if (!email) return setErrorMsg("Ingresa tu correo.");
    if (!password) return setErrorMsg("Ingresa una contraseña.");
    if (!fullName) return setErrorMsg("Ingresa tu nombre.");
    if (!emailAllowed(email))
      return setErrorMsg("Este correo no está autorizado.");

    try {
      setSubmitting(true);
      const redirectTo =
        Platform.OS === "web" && typeof window !== "undefined"
          ? window.location.origin
          : Linking.createURL("/");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: redirectTo,
        },
      });
      if (error) {
        const msg = String(error.message || "").toLowerCase();
        if (msg.includes("signups not allowed")) {
          setErrorMsg("Acceso privado: los registros están deshabilitados.");
        } else if (msg.includes("user already registered")) {
          setErrorMsg("Este correo ya está registrado.");
        } else {
          setErrorMsg("No se pudo completar el registro.");
        }
        console.error("Sign up error:", error);
      } else {
        if (!data?.user?.email_confirmed_at) {
          setInfoMsg(
            "Te enviamos un correo de verificación. Confirma para poder iniciar sesión."
          );
        } else {
          setInfoMsg("Registro exitoso. Ya puedes iniciar sesión.");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    setErrorMsg("");
    setInfoMsg("");
    if (!email) return setErrorMsg("Ingresa tu correo para reenviar.");
    try {
      setResending(true);
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) {
        const msg = String(error.message || "").toLowerCase();
        if (error.status === 429 || msg.includes("retry")) {
          setErrorMsg("Demasiados intentos. Reintenta en unos segundos.");
        } else {
          setErrorMsg("No se pudo reenviar el correo.");
        }
        console.error("Resend verification error:", error);
      } else {
        setInfoMsg(
          "Correo de verificación reenviado. Revisa tu bandeja y spam."
        );
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={["#3d18c3", "#4816bf"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            key={isLandscape ? "landscape" : "portrait"}
            style={{ flex: 1, backgroundColor: "#f8fafc" }}
          >
            <TouchableWithoutFeedback
              onPress={Platform.OS !== "web" && Keyboard.dismiss}
            >
              <View className="flex-1">
                <HeaderAdmin
                  logoSource={require("../assets/MQerK_logo.png")}
                  onLogoPress={() => {}}
                  title="Fenix Retail"
                  showActions={false}
                />
                {isLandscape ? (
                  <ScrollView
                    contentContainerStyle={{
                      flexGrow: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 24,
                    }}
                    keyboardShouldPersistTaps="handled"
                  >
                    {renderForm()}
                  </ScrollView>
                ) : (
                  <View className="flex-1 items-center justify-center px-4 py-6">
                    {renderForm()}
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );

  function renderForm() {
    return (
      <View className="w-full max-w-[420px] sm:max-w-[560px] bg-white rounded-2xl p-5 shadow-lg border border-slate-200">
        <Text className="text-slate-900 text-2xl font-extrabold mb-1">
          Regístrate
        </Text>
        <Text className="text-slate-600 mb-6">
          Crea tu cuenta para continuar
        </Text>

        <View className="gap-y-3">
          <Text className="text-slate-800 font-bold">Nombre completo</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Tu nombre"
            className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900"
            placeholderTextColor="#9ca3af"
          />
          <Text className="text-slate-800 font-bold">Correo</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="tucorreo@dominio.com"
            autoCapitalize="none"
            keyboardType="email-address"
            className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900"
            placeholderTextColor="#9ca3af"
          />
          <Text className="text-slate-800 font-bold">Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Tu contraseña"
            autoCapitalize="none"
            secureTextEntry
            className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900"
            placeholderTextColor="#9ca3af"
          />
          <Pressable
            onPress={onRegister}
            disabled={submitting}
            className={`mt-1 rounded-xl py-3.5 items-center ${submitting ? "bg-violet-400" : "bg-[#6F09EA]"}`}
            hitSlop={10}
            android_ripple={{ color: "rgba(255,255,255,0.15)" }}
          >
            <Text className="text-white font-bold">
              {submitting ? "Creando…" : "Crear cuenta"}
            </Text>
          </Pressable>
          {!!errorMsg && (
            <Text className="text-red-600 text-sm absolute bottom-[3rem] right-0 left-0 text-center">
              {errorMsg}
            </Text>
          )}
          {!!infoMsg && (
            <Text className="text-green-700 text-sm">{infoMsg}</Text>
          )}
          <View className="mt-[1.5rem] items-center">
            <Text className="text-slate-600 text-xs">
              ¿No te llegó el correo?
            </Text>
            <Pressable
              onPress={onResend}
              disabled={resending}
              className="mt-1"
              hitSlop={8}
              android_ripple={{ color: "rgba(0,0,0,0.05)" }}
            >
              <Text
                className={`font-bold ${resending ? "text-slate-400" : "text-[#6F09EA]"}`}
              >
                {resending ? "Reenviando…" : "Reenviar verificación"}
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-5 items-center">
          <Text className="text-slate-600">
            ¿Ya tienes cuenta?{" "}
            <Text
              className="text-[#6F09EA] font-bold"
              onPress={() => navigation?.navigate("Login")}
            >
              Inicia sesión
            </Text>
          </Text>
        </View>
      </View>
    );
  }
}
