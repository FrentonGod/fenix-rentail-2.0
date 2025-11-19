import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  ActivityIndicator,
  Image,
  useWindowDimensions,
  Touchable,
  TouchableWithoutFeedback,
  Modal,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import ConstellationBackground from "../components/backgrounds/ConstellationBackground";
import { supabase } from "../lib/supabase";
import * as Linking from "expo-linking";
import { useState, useEffect } from "react";
import HeaderAdmin from "../components/HeaderAdmin";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const InputModal = ({
  visible,
  onClose,
  label,
  value,
  onChangeText,
  ...textInputProps
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType={Platform.OS === "ios" ? "slide" : "fade"}
      onRequestClose={onClose}
    >
      <BlurView
        intensity={100}
        tint="dark"
        className="flex-1 justify-center items-center"
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            className="flex-1 justify-center items-center w-full p-4"
            style={Platform.OS === "ios" ? { paddingBottom: 100 } : {}}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                {/* Header con gradiente */}
                <LinearGradient
                  colors={["#6F09EA", "#7009E8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="p-5 flex-row justify-between items-center"
                >
                  <Text className="text-xl font-bold text-white">{label}</Text>
                  <Pressable
                    onPress={onClose}
                    hitSlop={15}
                    className="p-1 rounded-full bg-black/20"
                  >
                    <Svg
                      height="20"
                      viewBox="0 -960 960 960"
                      width="20"
                      fill="#ffffff"
                    >
                      <Path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </Svg>
                  </Pressable>
                </LinearGradient>

                {/* Cuerpo del modal */}
                <View className="p-6">
                  <TextInput
                    className="bg-slate-100 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-base focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    value={value}
                    onChangeText={onChangeText}
                    autoFocus={true}
                    {...textInputProps}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </BlurView>
    </Modal>
  );
};

const PressableInput = ({ label, value, onPress, icon }) => (
  <Pressable
    onPress={onPress}
    className="bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 flex-row items-center"
    style={{ height: 48 }}
  >
    <View className="absolute left-3" pointerEvents="none">
      {icon}
    </View>
    <Text className={value ? "text-slate-900" : "text-slate-400"}>
      {value || label}
    </Text>
  </Pressable>
);

export default function LoginScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const bpSmall = 640;
  const bpMedium = 900;
  const isSmall = width < bpSmall;
  const isTablet = width >= bpSmall && width < bpMedium;
  const isLarge = width >= bpMedium;
  const isLandscape = width > height && Platform.OS !== "web"; // Solo en móvil/tablet
  const showHeroArt = width >= 600;
  const cardMaxWidth = Math.min(
    720,
    Math.max(520, Math.round(width * (isLarge ? 0.66 : isTablet ? 0.76 : 0.92)))
  );
  const variant = (
    process.env.EXPO_PUBLIC_LOGIN_VARIANT || "classic"
  ).toLowerCase();
  const redirectTo =
    Platform.OS === "web" && typeof window !== "undefined"
      ? window.location.origin
      : Linking.createURL("/");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwdFocused, setPwdFocused] = useState(false);
  const allowedDomains = (process.env.EXPO_PUBLIC_AUTH_ALLOWED_DOMAINS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const allowedEmails = (process.env.EXPO_PUBLIC_AUTH_ALLOWED_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // --- Estado para el modal de inputs en landscape ---
  const [modalInputVisible, setModalInputVisible] = useState(false);
  const [editingField, setEditingField] = useState(null); // 'email' o 'password'

  // --- Lógica para el efecto de máquina de escribir ---
  const welcomeText = "¡Bienvenido!";
  const [typedText, setTypedText] = useState("");
  const [showCaret, setShowCaret] = useState(false);
  const [caretVisible, setCaretVisible] = useState(true);

  const handleInputPress = (field) => {
    setEditingField(field);
    setModalInputVisible(true);
  };

  useEffect(() => {
    // Reiniciar el texto si el componente se vuelve a montar
    setTypedText("");
    setShowCaret(false);
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < welcomeText.length) {
        setTypedText(welcomeText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(intervalId);
        setShowCaret(true); // Mostrar el cursor al terminar
      }
    }, 80); // Velocidad de escritura más rápida (antes 150ms)

    return () => clearInterval(intervalId); // Limpieza al desmontar
  }, []);

  // Efecto para el parpadeo del cursor (caret)
  useEffect(() => {
    if (!showCaret) return;

    // Iniciar el parpadeo
    const caretIntervalId = setInterval(() => {
      setCaretVisible((v) => !v);
    }, 500); // Velocidad de parpadeo

    return () => clearInterval(caretIntervalId); // Limpieza
  }, [showCaret]);

  const emailAllowed = (value) => {
    if (!value) return false;
    const lower = value.toLowerCase();
    if (allowedEmails.length > 0) return allowedEmails.includes(lower);
    if (allowedDomains.length === 0) return true;
    const domain = value.split("@")[1]?.toLowerCase();
    return !!domain && allowedDomains.includes(domain);
  };

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onPasswordLogin = async () => {
    setErrorMsg("");
    setNeedsVerification(false);
    if (!email) return setErrorMsg("Ingresa tu correo.");
    if (!password) return setErrorMsg("Ingresa tu contraseña.");
    if (!emailRe.test(email)) {
      return setErrorMsg("El formato del correo es inválido.");
    }
    if (!emailAllowed(email))
      // Esta validación se mantiene
      return setErrorMsg("Este correo no está autorizado.");
    try {
      setSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        const msg = String(error.message || "").toLowerCase();
        if (msg.includes("invalid login credentials")) {
          setErrorMsg("Correo o contraseña inválidos.");
        } else if (
          msg.includes("email not confirmed") ||
          msg.includes("confirm")
        ) {
          setErrorMsg("Debes confirmar tu correo antes de iniciar sesión.");
          setNeedsVerification(true);
        } else {
          setErrorMsg("No fue posible iniciar sesión.");
        }
        console.error("Password sign-in error:", error);
      }
      // Si no hay error, la sesión se establece y el RootNavigator redirige.
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    setErrorMsg("");
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
        setErrorMsg(
          "Correo de verificación reenviado. Revisa tu bandeja y spam."
        );
      }
    } finally {
      setResending(false);
    }
  };

  const onResetPassword = async () => {
    setErrorMsg("");
    if (!email)
      return setErrorMsg("Ingresa tu correo para recuperar tu contraseña.");
    try {
      setSubmitting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) {
        setErrorMsg("No se pudo enviar el correo de recuperación.");
        console.error("Reset password error:", error);
      } else {
        setErrorMsg("Te enviamos un correo para restablecer tu contraseña.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onGooglePress = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: false,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) console.error("Google sign-in error:", error);
    else if (data?.url) Linking.openURL(data.url);
  };

  const onApplePress = async () => {
    const serviceId = process.env.EXPO_PUBLIC_APPLE_AUTH_SERVICE_ID;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo,
        queryParams: serviceId
          ? { response_type: "code", response_mode: "form_post" }
          : undefined,
      },
    });
    if (error) console.error("Apple sign-in error:", error);
    else if (data?.url) Linking.openURL(data.url);
  };

  return (
    <SafeAreaProvider className="flex-1">
      <LinearGradient
        colors={["#3d18c3", "#4816bf"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1">
          <InputModal
            visible={modalInputVisible}
            onClose={() => setModalInputVisible(false)}
            label={
              editingField === "email" ? "Correo Electrónico" : "Contraseña"
            }
            value={editingField === "email" ? email : password}
            onChangeText={
              editingField === "email"
                ? (text) => setEmail(text.replace(/\s/g, "")) // Elimina espacios para el correo
                : setPassword
            }
            placeholder={
              editingField === "email" ? "tucorreo@dominio.com" : "•••••••••"
            }
            keyboardType={
              editingField === "email" ? "email-address" : "default"
            }
            autoCapitalize="none"
            secureTextEntry={editingField === "password"}
            autoCorrect={false}
            textContentType={
              editingField === "email" ? "emailAddress" : "password"
            }
          />

          <KeyboardAvoidingView
          behavior={Platform.OS !== "web" ? (!isLandscape && "padding"):""}
          keyboardVerticalOffset={`0`}
          className="flex-1 bg-[#f0ebfb]"
          enabled={!isLandscape}
          >
            <ScrollView
            keyboardDismissMode="interactive"
              contentContainerStyle={{
                flex:1,
                justifyContent: "center",
                overflow: "hidden",
              }}
              className="flex bg-slate-50"
            >
              <HeaderAdmin
                logoSource={require("../assets/MQerK_logo.png")}
                onLogoPress={() => {}}
                title="Fenix Retail"
                showActions={false}
              />
              <View className="items-center justify-center flex-1">
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    margin: "auto",
                  }}
                  pointerEvents="none"
                >
                  <ConstellationBackground
                    width={width}
                    height={height}
                    color={Platform.OS == "web" ? "#6F09EA" : "#f0ebfb"}
                  />
                </View>

                <View
                  id="login-card"
                  className="bg-white rounded-2xl overflow-hidden"
                >
                  {/* Header compacto con logo + tagline */}
                  <View className="border border-b-0 border-[#8756E5] rounded-t-2xl box-content">
                    <LinearGradient
                      colors={["#6F09EA", "#7009E8"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        paddingVertical: 20,
                        paddingInline: 10,
                      }}
                    >
                      {showHeroArt ? (
                        <View className="flex-row w-fit items-center gap-x-7 justify-between ">
                          <Image
                            className=""
                            source={require("../assets/MQerK_logo.png")}
                            style={{ width: 84, height: 84 }}
                            resizeMode="contain"
                          />
                          {/* Contenedor para el efecto de máquina de escribir */}
                          <View
                            id="texto-bienvenida"
                            className="flex-row items-center"
                          >
                            {/* Parte Visible */}
                            <View className={`flex-row items-center relative`}>
                              <Text
                                id="texto-bienvenida-visible"
                                className="text-white font-extrabold absolute left-0 right-1 m-auto"
                                style={{ fontSize: 24 }}
                              >
                                {typedText}
                              </Text>
                              <Text
                                id="texto-bienvenida-oculto"
                                className="font-extrabold"
                                style={{ fontSize: 24, color: "transparent" }}
                              >
                                ¡Bienvenido!|
                              </Text>
                              <Text
                                id="caret-visible"
                                className="text-white font-extrabold absolute right-0"
                                style={{
                                  fontSize: 24,
                                  opacity: showCaret
                                    ? caretVisible
                                      ? 1
                                      : 0
                                    : 0,
                                }}
                              >
                                |
                              </Text>
                            </View>
                          </View>
                          <Image
                            className=""
                            source={require("../assets/guardianes.png")}
                            style={{ width: 84, height: 84 }}
                            resizeMode="contain"
                          />
                        </View>
                      ) : (
                        <View className="items-center justify-center">
                          <Image
                            source={require("../assets/MQerK_logo.png")}
                            style={{ width: 120, height: 120 }}
                            resizeMode="contain"
                          />
                        </View>
                      )}
                    </LinearGradient>
                  </View>

                  {/* Cuerpo del formulario */}
                  <KeyboardAvoidingView>
                    <View className="p-7 border border-t-0 border-[#8756E5] bg-slate-50 rounded-b-2xl box-content">
                      <Text
                        className="text-slate-900 font-extrabold mb-1 text-center"
                        style={{ fontSize: isLarge ? 30 : isTablet ? 28 : 24 }}
                      >
                        Inicio de sesión
                      </Text>
                      <Text className="text-slate-500 text-center mb-5">
                        Accede a tu cuenta para continuar
                      </Text>
                      <View className="gap-y-3">
                        <Text className="text-slate-800 font-bold">Correo</Text>
                        <View className="relative">
                          {isLandscape ? (
                            <PressableInput
                              label="tucorreo@dominio.com"
                              value={email}
                              onPress={() => handleInputPress("email")}
                              icon={
                                <Svg
                                  width={18}
                                  height={18}
                                  viewBox="0 -960 960 960"
                                  fill="#64748b"
                                >
                                  <Path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm320-260L160-640v360h640v-360L480-460Zm0-60 320-180H160l320 180Z" />
                                </Svg>
                              }
                            />
                          ) : (
                            <>
                              <View
                                pointerEvents="none"
                                style={{
                                  position: "absolute",
                                  left: 12,
                                  top: "50%",
                                  transform: [{ translateY: -9 }],
                                  zIndex: 1,
                                }}
                              >
                                <Svg
                                  width={18}
                                  height={18}
                                  viewBox="0 -960 960 960"
                                  fill="#64748b"
                                >
                                  <Path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm320-260L160-640v360h640v-360L480-460Zm0-60 320-180H160l320 180Z" />
                                </Svg>
                              </View>
                              <TextInput
                                placeholder="tucorreo@dominio.com"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                onChangeText={(text) => {
                                  // Evita que se puedan ingresar espacios
                                  setEmail(text.replace(/\s/g, ""));
                                }}
                                className={`bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900`}
                                onFocus={() => {
                                  if (Platform.OS !== "web")
                                    setEmailFocused(true);
                                }}
                                onBlur={() => {
                                  if (Platform.OS !== "web")
                                    setEmailFocused(false);
                                }}
                                style={[
                                  { height: 48 },
                                  Platform.OS !== "web" && emailFocused
                                    ? { borderColor: "#6F09EA" }
                                    : null,
                                ]}
                                autoCorrect={false}
                                importantForAutofill="yes"
                                textContentType={
                                  Platform.OS === "ios"
                                    ? "emailAddress"
                                    : undefined
                                }
                                autoComplete="email"
                                blurOnSubmit={false}
                                placeholderTextColor="#9ca3af"
                                onKeyPress={(e) => {
                                  if (
                                    Platform.OS === "web" &&
                                    e?.nativeEvent?.key === "Enter"
                                  ) {
                                    e.preventDefault?.();
                                  }
                                }}
                                value={email}
                              />
                            </>
                          )}
                        </View>

                        <Text className="text-slate-800 font-bold">
                          Contraseña
                        </Text>
                        <View className="relative">
                          {isLandscape ? (
                            <PressableInput
                              label="•••••••••"
                              value={password ? "•••••••••" : ""}
                              onPress={() => handleInputPress("password")}
                              icon={
                                <Svg
                                  width={18}
                                  height={18}
                                  viewBox="0 -960 960 960"
                                  fill="#64748b"
                                >
                                  <Path d="M240-440v-200q0-100 70-170t170-70q100 0 170 70t70 170v200h40q33 0 56.5 23.5T840-360v280q0 33-23.5 56.5T760-0H200q-33 0-56.5-23.5T120-80v-280q0-33 23.5-56.5T200-440h40Zm80 0h320v-200q0-67-46.5-113.5T480-800q-67 0-113.5 46.5T320-640v200Z" />
                                </Svg>
                              }
                            />
                          ) : (
                            <>
                              <View
                                style={{
                                  position: "absolute",
                                  left: 12,
                                  top: "50%",
                                  transform: [{ translateY: -9 }],
                                  zIndex: 2,
                                }}
                                pointerEvents="none"
                              >
                                <Svg
                                  width={18}
                                  height={18}
                                  viewBox="0 -960 960 960"
                                  fill="#64748b"
                                >
                                  <Path d="M240-440v-200q0-100 70-170t170-70q100 0 170 70t70 170v200h40q33 0 56.5 23.5T840-360v280q0 33-23.5 56.5T760-0H200q-33 0-56.5-23.5T120-80v-280q0-33 23.5-56.5T200-440h40Zm80 0h320v-200q0-67-46.5-113.5T480-800q-67 0-113.5 46.5T320-640v200Z" />
                                </Svg>
                              </View>
                              <TextInput
                                id="password-input"
                                placeholder="•••••••••"
                                autoCapitalize="none"
                                secureTextEntry={!showPwd}
                                onChangeText={setPassword}
                                className={`bg-white border border-slate-300 rounded-xl pl-10 pr-12 py-3 text-slate-900`}
                                onFocus={() => {
                                  if (Platform.OS !== "web")
                                    setPwdFocused(true);
                                }}
                                onBlur={() => {
                                  if (Platform.OS !== "web")
                                    setPwdFocused(false);
                                }}
                                style={[
                                  { height: 48 },
                                  { fontSize: 14 },
                                  Platform.OS !== "web" ? { zIndex: 1 } : null,
                                  Platform.OS !== "web" && pwdFocused
                                    ? { borderColor: "#6F09EA" }
                                    : null,
                                ]}
                                autoCorrect={false}
                                importantForAutofill="yes"
                                textContentType={
                                  Platform.OS === "ios" ? "password" : undefined
                                }
                                autoComplete="current-password"
                                blurOnSubmit={false}
                                placeholderTextColor="#9ca3af"
                                onKeyPress={(e) => {
                                  if (
                                    Platform.OS === "web" &&
                                    e?.nativeEvent?.key === "Enter"
                                  ) {
                                    e.preventDefault?.();
                                  }
                                }}
                                value={password}
                              />
                              <Pressable
                                onPress={() => setShowPwd((v) => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full items-center justify-center bg-white/70 border border-slate-300 shadow-sm active:opacity-80"
                                hitSlop={10}
                                accessibilityLabel={
                                  showPwd
                                    ? "Ocultar contraseña"
                                    : "Mostrar contraseña"
                                }
                                style={
                                  Platform.OS === "web"
                                    ? { cursor: "pointer" }
                                    : { zIndex: 2 }
                                }
                              >
                                {showPwd ? (
                                  <Svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <Path
                                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"
                                      stroke="#475569"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <Path
                                      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                      stroke="#475569"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </Svg>
                                ) : (
                                  <Svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <Path
                                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"
                                      stroke="#475569"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <Path
                                      d="M3 3l18 18"
                                      stroke="#475569"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </Svg>
                                )}
                              </Pressable>
                            </>
                          )}
                        </View>

                        <View className="flex-row items-center justify-between mt-1">
                          <Pressable
                            onPress={onResetPassword}
                            disabled={submitting}
                            hitSlop={8}
                            android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                          >
                            <Text className="text-[#6F09EA] font-bold">
                              ¿Olvidaste tu contraseña?
                            </Text>
                          </Pressable>
                        </View>

                        <Pressable
                          onPress={onPasswordLogin}
                          disabled={submitting}
                          className="mt-3 rounded-xl"
                          hitSlop={10}
                          android_ripple={{
                            color: "rgba(255,255,255,0.15)",
                            borderless: false,
                          }}
                          style={
                            Platform.OS === "web"
                              ? {
                                  cursor: submitting
                                    ? "not-allowed"
                                    : "pointer",
                                  borderRadius: 12,
                                }
                              : { borderRadius: 12 }
                          }
                        >
                          <LinearGradient
                            colors={
                              submitting
                                ? ["#9F7AEA", "#9F7AEA"]
                                : ["#6F09EA", "#7009E8"]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                              borderRadius: 12,
                              paddingVertical: 16,
                              alignItems: "center",
                            }}
                          >
                            {submitting ? (
                              <ActivityIndicator color="#fff" />
                            ) : (
                              <Text className="text-white font-bold text-[16px]">
                                Iniciar sesión
                              </Text>
                            )}
                          </LinearGradient>
                        </Pressable>

                        {!!errorMsg && (
                          <Text className="text-red-600 absolute ml-2 -bottom-[2rem] right-0 left-0 text-center text-sm mt-1">
                            {errorMsg}
                          </Text>
                        )}
                        {needsVerification && (
                          <View className="mt-2 items-start">
                            <Pressable
                              onPress={onResend}
                              disabled={resending}
                              hitSlop={8}
                              android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                            >
                              <Text
                                className={`font-bold ${resending ? "text-slate-400" : "text-[#6F09EA]"}`}
                              >
                                {resending
                                  ? "Reenviando…"
                                  : "Reenviar verificación"}
                              </Text>
                            </Pressable>
                          </View>
                        )}
                        {allowedDomains.length > 0 && (
                          <Text className="text-slate-500 text-xs">
                            Solo se permiten correos de:{" "}
                            {allowedDomains.join(", ")}
                          </Text>
                        )}
                      </View>

                      <View className="mt-10 items-center">
                        <Text className="text-slate-600">
                          ¿No tienes cuenta?{" "}
                          <Text
                            className="text-[#6F09EA] font-bold"
                            onPress={() => navigation?.navigate("Register")}
                          >
                            Regístrate
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </KeyboardAvoidingView>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
