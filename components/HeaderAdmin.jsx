import React, { useMemo, useRef, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

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
 */
function HeaderAdmin({
  title = 'MQerK Aca',
  subtitle = '',
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
  showActions = true,
  sizeVariant = 'default', // 'default' | 'login' | 'loginXL'
}) {
  const { width } = useWindowDimensions();
  const isSmall = width < 640; // móvil
  const isTablet = width >= 640 && width < 1024; // tablet (iPad Mini ~768)
  const scale = sizeVariant === 'login' ? 1.15 : sizeVariant === 'loginXL' ? 1.35 : 1;
  const avatarSize = Math.round((isSmall ? 44 : isTablet ? 52 : 56) * scale);


  const getInitials = (name) => {
    if (!name) return 'AD';
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
        paddingTop: sizeVariant === 'login' ? 24 : sizeVariant === 'loginXL' ? 32 : undefined,
        paddingBottom: sizeVariant === 'login' ? 24 : sizeVariant === 'loginXL' ? 32 : undefined,
      }}
    >
      <View className={`flex-row justify-between relative ${onLogout ? "py-2":"py-0"} ${Platform.OS === 'web' ? 'items-center' : ''}`}>
        {/* Zona izquierda: menú + logo */}
        <View className="flex-row items-center" style={{ gap: isSmall ? 4 : 8, minWidth: isSmall ? 72 : 92 }}>
          {showMenuButton && (
            <Pressable
              onPress={onMenuPress}
              hitSlop={10}
              android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
              accessibilityLabel="Abrir menú"
            >
              <Svg width={isSmall ? 22 : 26} height={isSmall ? 22 : 26} viewBox="0 -960 960 960" fill="#ffffff">
                <Path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </Svg>
            </Pressable>
          )}
          <Pressable
            onPress={onLogoPress}
            hitSlop={10}
            android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
          >
            {logoSource ? (
              <Image source={logoSource} resizeMode="contain" style={{ width: Math.round((isSmall ? 40 : isTablet ? 52 : 56) * scale), height: Math.round((isSmall ? 40 : isTablet ? 52 : 56) * scale) }} />
            ) : (
              <View className="rounded-full bg-white/20 items-center justify-center" style={{ width: Math.round((isSmall ? 40 : isTablet ? 52 : 56) * scale), height: Math.round((isSmall ? 40 : isTablet ? 52 : 56) * scale) }}>
                <Text className="text-white font-extrabold" style={{ fontSize: Math.round((isSmall ? 14 : isTablet ? 16 : 18) * scale) }}>MQ</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Zona centro: títulos (sin posición absoluta) */}
        <View className="items-center absolute left-0 right-0 m-auto">
          <Text
            className="text-white font-extrabold text-center tracking-wide"
            style={{ fontSize: Math.round((isSmall ? 18 : isTablet ? 22 : 26) * scale) }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {!!subtitle && (
            <Text className="text-white/90 text-sm text-center uppercase tracking-wider mt-1" numberOfLines={1} ellipsizeMode="tail">
              {subtitle}
            </Text>
          )}
        </View>

        {/* Zona derecha: acciones */}
        {showActions && (
        <View className="flex-row items-center" style={{ minWidth: isSmall ? 72 : 92 }}>

          {/* Avatar Perfil */}
          <View className={`border-2 box-content rounded-full border-white`}>
            <Pressable
              className="rounded-full overflow-hidden items-center justify-center bg-blue-600 active:opacity-80"
              style={{ width: avatarSize, height: avatarSize }}
              hitSlop={8}
              android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true }}
              accessibilityLabel="Menú de perfil"
            >
              {adminProfile?.avatar ? (
                <Image source={{ uri: adminProfile.avatar }} style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }} />
              ) : (
                <Text className="text-white font-bold" style={{ fontSize: isSmall ? 14 : 16 }}>
                  {getInitials(adminProfile?.name)}
                </Text>
              )}
            </Pressable>
            {/* Indicador online */}
            <View className="absolute -bottom-1 -right-1 bg-green-400 border-2 border-white rounded-full" style={{ width: isSmall ? 12 : 14, height: isSmall ? 12 : 14 }} />

          </View>
        </View>
        )}
      </View>
      {/* Backdrop para cerrar menús al tocar fuera */}
    </LinearGradient>
  );
}

// Evitar re-renders innecesarios si las props no cambian superficialmente
export default React.memo(HeaderAdmin);
