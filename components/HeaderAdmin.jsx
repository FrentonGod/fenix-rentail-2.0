import React, { useMemo, useRef, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
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
  title = 'MQerK Academy',
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const displayedNotifications = useMemo(() => notifications, [notifications]);

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
      className="w-full px-4 sm:px-8 py-5 md:py-6"
      style={{
        paddingTop: sizeVariant === 'login' ? 24 : sizeVariant === 'loginXL' ? 32 : undefined,
        paddingBottom: sizeVariant === 'login' ? 24 : sizeVariant === 'loginXL' ? 32 : undefined,
      }}
    >
      <View className="w-full flex-row items-center justify-between">
        {/* Zona izquierda: menú + logo */}
        <View className="pl-1 pr-2 py-1 flex-row items-center" style={{ gap: isSmall ? 4 : 8, minWidth: isSmall ? 72 : 92 }}>
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
        <View style={{ flex: 1 }} className="items-center px-2 overflow-hidden">
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
        <View className="flex-row items-center pr-1" style={{ gap: isSmall ? 4 : 8, minWidth: isSmall ? 72 : 92 }}>
          {/* Botón Notificaciones */}
          {!isSmall && (
          <View>
            <Pressable
              onPress={() => {
                setIsNotificationsOpen((v) => !v);
                setIsProfileOpen(false);
              }}
              className="rounded-full items-center justify-center active:opacity-80"
              hitSlop={8}
              android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true }}
              accessibilityLabel="Ver notificaciones"
            >
              <Svg width={isSmall ? 22 : 26} height={isSmall ? 22 : 26} viewBox="0 -960 960 960" fill="#ffffff">
                <Path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </Svg>
              {unreadCount > 0 && (
                <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 items-center justify-center">
                  <Text className="text-white text-xs font-bold">{unreadCount}</Text>
                </View>
              )}
            </Pressable>

            {/* Dropdown Notificaciones */}
            {isNotificationsOpen && (
              <View className="absolute mt-2 right-0 w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-2">
                <View className="flex-row items-center justify-between px-1 py-1">
                  <Text className="text-slate-900 font-semibold">Notificaciones</Text>
                  {unreadCount > 0 && (
                    <Text className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{unreadCount} nuevas</Text>
                  )}
                </View>
                {unreadCount > 0 && (
                  <Pressable onPress={onMarkAllAsRead} className="px-2 py-1">
                    <Text className="text-blue-600 text-xs font-medium">Marcar como leído</Text>
                  </Pressable>
                )}
                <View style={{ maxHeight: 260 }} className="mt-1">
                  {displayedNotifications?.length ? (
                    displayedNotifications.map((n) => (
                      <Pressable
                        key={String(n.id)}
                        onPress={() => {
                          onNotificationPress && onNotificationPress(n);
                          setIsNotificationsOpen(false);
                        }}
                        className="px-2 py-2 rounded-md active:bg-slate-100"
                      >
                        <Text className="text-slate-800 text-sm">{n.message}</Text>
                      </Pressable>
                    ))
                  ) : (
                    <View className="px-2 py-4 items-center">
                      <Text className="text-slate-500 text-sm">No hay notificaciones</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
          )}

          {/* Avatar Perfil */}
          <View>
            <Pressable
              onPress={() => {
                setIsProfileOpen((v) => !v);
                setIsNotificationsOpen(false);
              }}
              className="rounded-full overflow-hidden border-2 border-white items-center justify-center bg-blue-600 active:opacity-80"
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

            {/* Dropdown Perfil */}
            {isProfileOpen && (
              <View className="absolute mt-2 right-0 w-64 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                <View className="bg-blue-600/80 px-3 py-3">
                  <Text className="text-white font-semibold text-sm">{adminProfile?.name || 'Administrator'}</Text>
                  <Text className="text-blue-100 text-xs">{adminProfile?.role || 'Admin'}</Text>
                </View>

                <View className="px-3 py-2">
                  <Text className="text-[11px] text-slate-500">Correo</Text>
                  <Text className="text-sm text-slate-800">{adminProfile?.email || 'admin@mqerk.academy'}</Text>
                </View>

                <View className="px-3 py-2">
                  <Text className="text-[11px] text-slate-500">Último acceso</Text>
                  <Text className="text-sm text-slate-800">{adminProfile?.lastLogin ? String(adminProfile.lastLogin) : 'Hoy'}</Text>
                </View>

                <View className="border-t border-slate-200" />
                <Pressable onPress={onLogout} className="px-3 py-3 active:bg-red-50">
                  <Text className="text-red-600 text-sm font-medium">Cerrar sesión</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
        )}
      </View>
      {/* Backdrop para cerrar menús al tocar fuera */}
      {(isNotificationsOpen || isProfileOpen) && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => { setIsNotificationsOpen(false); setIsProfileOpen(false); }}
        />
      )}
    </LinearGradient>
  );
}

// Evitar re-renders innecesarios si las props no cambian superficialmente
export default React.memo(HeaderAdmin);
