import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

/**
 * HeaderAdmin (React Native / Expo)
 * - Diseño inspirado en el header web proporcionado
 * - Sin dependencias de react-router-dom ni contextos externos
 * - Controlado por props para integrar con tu navegación y datos reales
 *
 * Props:
 * - title?: string
 * - subtitle?: string
 * - logoSource?: ImageSourcePropType
 * - onLogoPress?: () => void
 * - unreadCount?: number
 * - notifications?: Array<{ id: string|number, message: string, meta?: any }>
 * - onNotificationPress?: (n) => void
 * - onMarkAllAsRead?: () => void
 * - adminProfile?: { name?: string, email?: string, role?: string, avatar?: string, lastLogin?: string|number }
 * - onLogout?: () => void
 * - onNavigateToSettings?: () => void
 */
function HeaderAdmin({
  title = "Fenix Retail",
  subtitle = "",
  logoSource,
  onLogoPress,
  showMenuButton = false,
  onMenuPress,
  unreadCount = 0,
  notifications = [],
  onNotificationPress,
  onMarkAllAsRead,
  adminProfile,
  onLogout,
  onNavigateToSettings,
  showActions = true,
  sizeVariant = "default", // 'default' | 'login' | 'loginXL'
}) {
  const { width } = useWindowDimensions();
  const isSmall = width < 640; // móvil
  const isTablet = width >= 640 && width < 1024; // tablet (iPad Mini ~768)
  const scale =
    sizeVariant === "login" ? 1.15 : sizeVariant === "loginXL" ? 1.35 : 1;
  const avatarSize = Math.round((isSmall ? 44 : isTablet ? 52 : 56) * scale);

  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  const getInitials = (name) => {
    const parts = String(name).trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <LinearGradient
      colors={["#3d18c3", "#4816bf"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className={``}
      style={{
        paddingTop:
          sizeVariant === "login"
            ? 24
            : sizeVariant === "loginXL"
              ? 32
              : undefined,
        paddingBottom:
          sizeVariant === "login"
            ? 24
            : sizeVariant === "loginXL"
              ? 32
              : undefined,
      }}
    >
      <View
        className={`flex-row justify-between relative ${onLogout ? "py-2" : "py-0"} ${Platform.OS === "web" ? "items-center" : ""}`}
      >
        {/* Zona izquierda: menú + logo */}
        <View
          className={`flex-row items-center`}
          style={{ gap: isSmall ? 4 : 8, minWidth: isSmall ? 72 : 92 }}
        >
          {showMenuButton && (
            <Pressable
              onPress={onMenuPress}
              hitSlop={10}
              android_ripple={{
                color: "rgba(255,255,255,0.2)",
                borderless: true,
              }}
              accessibilityLabel="Abrir menú"
            >
              <Svg
                width={isSmall ? 22 : 26}
                height={isSmall ? 22 : 26}
                viewBox="0 -960 960 960"
                fill="#ffffff"
              >
                <Path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </Svg>
            </Pressable>
          )}
          <Pressable
            onPress={onLogoPress}
            hitSlop={10}
            android_ripple={{
              color: "rgba(255,255,255,0.2)",
              borderless: true,
            }}
          >
            {logoSource ? (
              <Image
                source={logoSource}
                resizeMode="contain"
                style={{
                  opacity: onLogout ? 1 : 0,
                  width: Math.round(
                    (isSmall ? 40 : isTablet ? 52 : 56) * scale
                  ),
                  height: Math.round(
                    (isSmall ? 40 : isTablet ? 52 : 56) * scale
                  ),
                }}
              />
            ) : (
              <View
                className="rounded-full bg-white/20 items-center justify-center"
                style={{
                  width: Math.round(
                    (isSmall ? 40 : isTablet ? 52 : 56) * scale
                  ),
                  height: Math.round(
                    (isSmall ? 40 : isTablet ? 52 : 56) * scale
                  ),
                }}
              >
                <Text
                  className="text-white font-extrabold"
                  style={{
                    fontSize: Math.round(
                      (isSmall ? 14 : isTablet ? 16 : 18) * scale
                    ),
                  }}
                >
                  MQ
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Zona centro: títulos (sin posición absoluta) */}
        <View
          className={`items-center ${onLogout ? "" : "absolute"} left-0 right-0 m-auto`}
        >
          <Text
            className="text-white font-extrabold text-center tracking-wide"
            style={{
              fontSize: Math.round((isSmall ? 18 : isTablet ? 22 : 26) * scale),
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {!!subtitle && (
            <Text
              className="text-white/90 text-sm text-center uppercase tracking-wider mt-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Zona derecha: acciones */}
        {showActions && (
          <View
            className="flex-row items-center"
            style={{ minWidth: isSmall ? 72 : 92 }}
          >
            {/* Avatar Perfil */}
            <View className={`border-2 box-content rounded-full border-white`}>
              <Pressable
                onPress={() => setProfileMenuVisible(true)}
                className="rounded-full overflow-hidden items-center justify-center bg-blue-600 active:opacity-80"
                style={{ width: avatarSize, height: avatarSize }}
                hitSlop={8}
                android_ripple={{
                  color: "rgba(255,255,255,0.25)",
                  borderless: true,
                }}
                accessibilityLabel="Menú de perfil"
              >
                {adminProfile?.avatar ? (
                  <Image
                    source={{ uri: adminProfile.avatar }}
                    style={{
                      width: avatarSize,
                      height: avatarSize,
                      borderRadius: avatarSize / 2,
                    }}
                  />
                ) : (
                  <Text
                    className="text-white font-bold"
                    style={{ fontSize: isSmall ? 14 : 16 }}
                  >
                    {getInitials(adminProfile?.name)}
                  </Text>
                )}
              </Pressable>
              {/* Indicador online */}
              <View
                className="absolute -bottom-1 -right-1 bg-green-400 border-2 border-white rounded-full"
                style={{ width: isSmall ? 12 : 14, height: isSmall ? 12 : 14 }}
              />
            </View>
          </View>
        )}
      </View>

      {/* Modal de perfil */}
      <Modal
        visible={profileMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProfileMenuVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setProfileMenuVisible(false)}
          className="flex-1 bg-black/50"
        >
          <View className="absolute top-16 right-4 bg-white rounded-2xl shadow-2xl w-80 overflow-hidden">
            <TouchableOpacity activeOpacity={1}>
              {/* Información del usuario */}
              <LinearGradient
                colors={["#6366f1", "#8b5cf6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ padding: 24 }}
              >
                <View className="flex-row items-center mb-3">
                  <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center border-2 border-white mr-4">
                    {adminProfile?.avatar ? (
                      <Image
                        source={{ uri: adminProfile.avatar }}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <Text className="text-white font-bold text-xl">
                        {getInitials(adminProfile?.name)}
                      </Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-white font-bold text-lg"
                      numberOfLines={1}
                    >
                      {adminProfile?.name || "Usuario"}
                    </Text>
                    <Text className="text-white/80 text-sm" numberOfLines={1}>
                      {adminProfile?.email || ""}
                    </Text>
                  </View>
                </View>
                <View className="bg-white/20 rounded-lg p-2">
                  <Text className="text-white/90 text-xs">
                    Última sesión: {adminProfile?.lastLogin || "Ahora"}
                  </Text>
                </View>
              </LinearGradient>

              {/* Opciones */}
              <View className="p-2">
                {onNavigateToSettings && (
                  <TouchableOpacity
                    onPress={() => {
                      setProfileMenuVisible(false);
                      onNavigateToSettings();
                    }}
                    className="flex-row items-center p-4 rounded-xl active:bg-slate-100"
                  >
                    <Svg
                      height="24"
                      viewBox="0 -960 960 960"
                      width="24"
                      fill="#475569"
                    >
                      <Path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                    </Svg>
                    <Text className="text-slate-700 font-semibold ml-3 flex-1">
                      Configuración
                    </Text>
                    <Svg
                      height="20"
                      viewBox="0 -960 960 960"
                      width="20"
                      fill="#94a3b8"
                    >
                      <Path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                    </Svg>
                  </TouchableOpacity>
                )}

                {onLogout && (
                  <TouchableOpacity
                    onPress={() => {
                      setProfileMenuVisible(false);
                      onLogout();
                    }}
                    className="flex-row items-center p-4 rounded-xl active:bg-red-50"
                  >
                    <Svg
                      height="24"
                      viewBox="0 -960 960 960"
                      width="24"
                      fill="#dc2626"
                    >
                      <Path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                    </Svg>
                    <Text className="text-red-600 font-bold ml-3 flex-1">
                      Cerrar sesión
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Backdrop para cerrar menús al tocar fuera */}
    </LinearGradient>
  );
}

// Evitar re-renders innecesarios si las props no cambian superficialmente
export default React.memo(HeaderAdmin);
