import "react-native-gesture-handler";
import {
  Text,
  View,
  Pressable,
  Image,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  TextInput,
  LogBox,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
  Alert,
  Switch,
} from "react-native";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { LinearGradient } from "expo-linear-gradient";
import equal from "fast-deep-equal";
import * as Clipboard from "expo-clipboard";
import "./global.css";

import Svg, { Path } from "react-native-svg";
import Ripple from "react-native-material-ripple";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import { BlurView } from "expo-blur";
import Slider from "@react-native-community/slider";
import { Calendar, LocaleConfig } from "react-native-calendars";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";

import { useFocusEffect } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import HeaderAdmin from "./components/HeaderAdmin";
import PagoTarjetaStripe from "./components/pagos/PagoTarjetaStripe";
import { supabase } from "./lib/supabase";
import { useAuthContext } from "./hooks/use-auth-context";
import RegistroAsesor from "./components/asesores/RegistroAsesor";

import RegistroEstudiantes from "./components/estudiantes/RegistroEstudiantes";
import RegistroVenta from "./components/ventas/RegistroVenta";
import ScreenConfiguracion from "./components/configuracion/ScreenConfiguracion";
const Tab = createMaterialTopTabNavigator(); //Aqui se esta creando el componente
const Drawer = createDrawerNavigator();

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function AuthFlow() {
  const { session, loading } = useAuthContext();

  // Mientras se verifica la sesión, mostramos un indicador de carga
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#3d18c3]">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // Si no hay sesión, mostramos el login. Si hay, la app principal.
  return session ? <AppScreens /> : <LoginScreen />;
}

export default AuthFlow;

function AppScreens() {
  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={["#3d18c3", "#4816bf"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{}} className={`flex-1`}>
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
              header: (props) => <AppHeader {...props} />, // Nuevo HeaderAdmin
              drawerStyle: {
                backgroundColor: "#232428",
                width: 200,
              },
              drawerActiveTintColor: "white",
              drawerInactiveTintColor: "#6b838b",
            }}
          >
            <Drawer.Screen
              name="Inicio"
              component={ScreenInicio}
              options={{
                title: "Inicio",
                drawerIcon: ({}) => (
                  <Svg
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    fill="#ffffff"
                  >
                    <Path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
                  </Svg>
                ),
              }}
            />

            <Drawer.Screen
              name="Estudiantes"
              component={ScreenEstudiantes}
              options={{
                title: "Estudiantes",
                drawerIcon: ({}) => (
                  <Svg
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    fill="#ffffff"
                  >
                    <Path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z" />
                  </Svg>
                ),
              }}
            />
            <Drawer.Screen
              name="Asesores"
              component={ScreenAsesores}
              options={{
                title: "Asesores",
                drawerIcon: ({}) => (
                  <Svg
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    fill="#ffffff"
                  >
                    <Path d="M840-120v-640H120v320H40v-320q0-33 23.5-56.5T120-840h720q33 0 56.5 23.5T920-760v560q0 33-23.5 56.5T840-120ZM360-400q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM40-80v-112q0-34 17.5-62.5T104-298q62-31 126-46.5T360-360q66 0 130 15.5T616-298q29 15 46.5 43.5T680-192v112H40Zm80-80h480v-32q0-11-5.5-20T580-226q-54-27-109-40.5T360-280q-56 0-111 13.5T140-226q-9 5-14.5 14t-5.5 20v32Zm240-400Zm0 400Z" />
                  </Svg>
                ),
              }}
            />
            <Drawer.Screen
              name="Pagos"
              component={ScreenPagos}
              options={{
                title: "Pagos",
                drawerIcon: ({}) => (
                  <Svg
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    fill="#ffffff"
                  >
                    <Path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" />
                  </Svg>
                ),
              }}
            />
            <Drawer.Screen
              name="Finanzas"
              component={ScreenFinanzas}
              options={{
                title: "Finanzas",
                drawerIcon: ({}) => (
                  <Svg
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#ffffff"
                  >
                    <Path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" />
                  </Svg>
                ),
              }}
            />
            <Drawer.Screen
              name="Calendario"
              component={ScreenCalendario}
              options={{
                title: "Calendario",
                drawerIcon: ({}) => (
                  <Svg
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    fill="#ffffff"
                  >
                    <Path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                  </Svg>
                ),
              }}
            />
            <Drawer.Screen
              name="Cursos"
              component={ScreenCursos}
              options={{
                title: "Cursos",
                drawerIcon: ({}) => (
                  <Svg
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    fill="#ffffff"
                  >
                    <Path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" />
                  </Svg>
                ),
              }}
            />
            <Drawer.Screen
              name="Configuración"
              component={ScreenConfiguracion}
              options={{
                title: "Configuración",
                drawerItemStyle: { display: "none" }, // Ocultar del menú principal
                drawerIcon: ({}) => (
                  <Svg
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    fill="#ffffff"
                  >
                    <Path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                  </Svg>
                ),
              }}
            />
          </Drawer.Navigator>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

function AppHeader({ navigation, route }) {
  const { profile, session } = useAuthContext();
  const [avatarUrl, setAvatarUrl] = useState("");

  // Cargar avatar del usuario
  useEffect(() => {
    const loadAvatar = async () => {
      if (!session?.user?.id) {
        setAvatarUrl("");
        return;
      }

      try {
        // Buscar avatar en la carpeta del usuario
        const { data: files } = await supabase.storage
          .from("PPUser")
          .list(session.user.id, {
            limit: 10,
            offset: 0,
          });

        // Buscar archivo que comience con "avatar"
        const avatarFile = files?.find((file) =>
          file.name.startsWith("avatar.")
        );

        if (avatarFile) {
          const {
            data: { publicUrl },
          } = supabase.storage
            .from("PPUser")
            .getPublicUrl(`${session.user.id}/${avatarFile.name}`);

          setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
        } else {
          // Si no hay archivo, limpiar la URL para mostrar iniciales
          setAvatarUrl("");
        }
      } catch (error) {
        console.error("Error loading avatar in header:", error);
        setAvatarUrl("");
      }
    };

    loadAvatar();
  }, [session, profile, route]); // Recargar cuando cambie el perfil o la ruta

  // Títulos de sección según la ruta actual del Drawer
  const routeTitles = {
    Inicio: "Panel Principal",
    Estudiantes: "Lista de Estudiantes",
    Asesores: "Asesores",
    Pagos: "Comprobantes de Pago",
    Finanzas: "Reportes de Pagos",
    Calendario: "Calendario",
    Cursos: "Cursos",
    Configuración: "Configuración de Usuario",
  };
  const currentSectionTitle = routeTitles[route?.name] || route?.name || "";
  return (
    <HeaderAdmin
      logoSource={require("./assets/MQerK_logo.png")}
      onLogoPress={() => navigation?.toggleDrawer?.()}
      showMenuButton={true}
      onMenuPress={() => navigation?.toggleDrawer?.()}
      title="Fenix Retail"
      subtitle={currentSectionTitle}
      adminProfile={{
        name: profile?.full_name || "Usuario",
        email: profile?.email || "",
        role: "Admin",
        lastLogin: new Date().toLocaleString(),
        avatar: avatarUrl || undefined, // Pasar la URL del avatar
      }}
      unreadCount={0}
      notifications={[]}
      onNotificationPress={() => {}}
      onMarkAllAsRead={() => {}}
      onNavigateToSettings={() => navigation?.navigate?.("Configuración")}
      onLogout={() =>
        supabase.auth.signOut().catch((e) => console.error("Sign out error", e))
      }
    />
  );
}

const CustomDrawerContent = (props) => {
  const { state, ...rest } = props;

  // Solo filtramos 'LogOut', dejamos 'Configuración' en el estado original
  const filteredRoutes = state.routes.filter((item) => item.name !== "LogOut");

  // Verificar si Configuración está activa
  const isConfigActive = state.routes[state.index]?.name === "Configuración";

  // Recalculamos el índice activo después del filtrado
  const activeRouteIndex = filteredRoutes.findIndex(
    (route) => route.key === state.routes[state.index]?.key
  );

  const newState = {
    ...state,
    routes: filteredRoutes,
    index: activeRouteIndex >= 0 ? activeRouteIndex : 0,
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList state={newState} {...rest} />
      </DrawerContentScrollView>
      <View
        style={{ padding: 5, borderTopColor: "#4a4a4a", borderTopWidth: 1 }}
      >
        <DrawerItem
          label="Configuración"
          activeTintColor="white"
          inactiveTintColor="#ffffff"
          focused={isConfigActive}
          onPress={() => props.navigation.navigate("Configuración")}
          icon={() => (
            <Svg height="24" viewBox="0 -960 960 960" width="24" fill="#ffffff">
              <Path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
            </Svg>
          )}
        />
        <DrawerItem
          label="Cerrar sesión"
          labelStyle={{ color: "#dc2626", fontWeight: "bold" }}
          onPress={() => {
            supabase.auth
              .signOut()
              .catch((e) => console.error("Sign out error", e));
          }}
          icon={() => (
            <Svg
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#dc2626"
            >
              <Path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
            </Svg>
          )}
        />
      </View>
    </View>
  );
};

const ScreenInicio = () => {
  const [catalogos, setCatalogos] = useState(false);
  const [isVentaFormOpen, setVentaFormOpen] = useState(false);
  return (
    <Tab.Navigator
      initialRouteName="Venta"
      tabBarPosition="top"
      screenOptions={{
        tabBarActiveTintColor: "#1f1f1f",
        tabBarInactiveTintColor: "#70757a",

        swipeEnabled: !isVentaFormOpen, // Deshabilita el swipe si el formulario está abierto
        tabBarItemStyle: { width: "auto", paddingHorizontal: 5 },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
          textTransform: "uppercase",
        },
        tabBarStyle: { backgroundColor: "#f8fafc" },
        tabBarIndicatorStyle: { backgroundColor: "#1f1f1f", height: 2 },
      }}
    >
      <Tab.Screen name="Venta">
        {(props) => (
          <SeccionVentas {...props} onFormToggle={setVentaFormOpen} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Reporte" component={SeccionReportes} />
      <Tab.Screen name="Catálogos">
        {() => (
          <SeccionCatalogos catalogos={catalogos} setCatalogos={setCatalogos} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const TablaVentasPendientes = ({
  data,
  query,
  isRefetching,
  onRefresh,
  onReprint,
  onRowClick, // Nueva prop
  selectedYear, // Año seleccionado para filtrar
}) => {
  const [sortKey, setSortKey] = useState("fecha_transaction");
  const [sortDir, setSortDir] = useState("desc");

  const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = data.filter((r) => {
      // Filtrar por año si está definido
      if (selectedYear && r.fecha_transaction) {
        const transactionYear = new Date(r.fecha_transaction).getFullYear();
        if (transactionYear !== selectedYear) return false;
      }

      if (!q) return true;
      return (
        String(r.nombre_estudiante).toLowerCase().includes(q) ||
        String(r.curso_asignado).toLowerCase().includes(q) ||
        String(r.grupo).toLowerCase().includes(q)
      );
    });
    const sorted = [...arr].sort((a, b) => {
      let va = a[sortKey] ?? "";
      let vb = b[sortKey] ?? "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, query, sortKey, sortDir, selectedYear]);

  // Agrupar por año o por mes según el filtro seleccionado
  const groupedData = useMemo(() => {
    if (selectedYear === null) {
      // Agrupar por año cuando se selecciona "Todos"
      const groups = filtered.reduce((acc, alumno) => {
        const year = alumno.fecha_transaction
          ? new Date(alumno.fecha_transaction).getFullYear()
          : "Sin fecha";
        if (!acc[year]) acc[year] = [];
        acc[year].push(alumno);
        return acc;
      }, {});

      const sortedYears = Object.keys(groups).sort((a, b) => {
        if (a === "Sin fecha") return 1;
        if (b === "Sin fecha") return -1;
        return b - a;
      });

      return { grouped: true, type: "year", keys: sortedYears, data: groups };
    } else {
      // Agrupar por mes cuando se selecciona un año específico
      const groups = filtered.reduce((acc, alumno) => {
        if (alumno.fecha_transaction) {
          const fecha = new Date(alumno.fecha_transaction);
          const mes = fecha.toLocaleDateString("es-MX", { month: "long" });
          const mesNumero = fecha.getMonth();
          const key = `${mesNumero}-${mes}`;
          if (!acc[key]) acc[key] = [];
          acc[key].push(alumno);
        }
        return acc;
      }, {});

      const sortedMonths = Object.keys(groups).sort((a, b) => {
        const numA = parseInt(a.split("-")[0]);
        const numB = parseInt(b.split("-")[0]);
        return numB - numA;
      });

      return { grouped: true, type: "month", keys: sortedMonths, data: groups };
    }
  }, [filtered, selectedYear]);

  const SortHeader = ({ label, k, flex = 1, center }) => (
    <Pressable
      onPress={() => {
        if (!k) return;
        setSortKey(k);
        setSortDir((d) =>
          sortKey === k ? (d === "asc" ? "desc" : "asc") : "asc"
        );
      }}
      className="py-3 px-3"
      style={{ flex, alignItems: center ? "center" : "flex-start" }}
      android_ripple={{ color: "rgba(0,0,0,0.05)" }}
    >
      <View className="flex-row items-center gap-1">
        <Text className="text-slate-800 font-semibold text-xs sm:text-sm uppercase tracking-wide">
          {label}
        </Text>
        {sortKey === k && (
          <Svg width={12} height={12} viewBox="0 -960 960 960" fill="#334155">
            {sortDir === "asc" ? (
              <Path d="M480-680 240-440h480L480-680Z" />
            ) : (
              <Path d="M240-520h480L480-280 240-520Z" />
            )}
          </Svg>
        )}
      </View>
    </Pressable>
  );

  return (
    <View className="px-2 flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor="#6F09EA"
          />
        }
      >
        <View className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <View className="bg-slate-100 border-b border-slate-200 flex-row">
            <SortHeader label="Curso" k="curso_asignado" flex={3} />
            <SortHeader label="Nombre" k="nombre_estudiante" flex={3} />
            <SortHeader label="Pendiente" k="monto_pendiente" flex={1.5} />
            <SortHeader label="Fecha" k="fecha_transaction" flex={1.5} />
            <SortHeader label="Grupo" k="grupo" flex={1.5} />
            <SortHeader label="" k={null} flex={1} center />
          </View>
          {filtered.length > 0 ? (
            groupedData.grouped ? (
              // Vista agrupada por años o meses
              groupedData.keys.map((key) => {
                const displayLabel =
                  groupedData.type === "month"
                    ? key.split("-")[1].charAt(0).toUpperCase() +
                      key.split("-")[1].slice(1)
                    : key;
                const icon =
                  groupedData.type === "month"
                    ? "M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Zm0 200q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Z"
                    : "M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z";

                return (
                  <View key={key}>
                    {/* Header del año o mes */}
                    <View className="bg-indigo-600 py-3 px-4 flex-row items-center border-t border-indigo-700">
                      <Svg
                        height="20"
                        viewBox="0 -960 960 960"
                        width="20"
                        fill="#ffffff"
                      >
                        <Path d={icon} />
                      </Svg>
                      <Text className="text-white font-bold text-lg ml-2">
                        {displayLabel}
                      </Text>
                      <View className="flex-1" />
                      <View className="bg-white/20 px-3 py-1 rounded-full">
                        <Text className="text-white text-sm font-semibold">
                          {groupedData.data[key].length}{" "}
                          {groupedData.data[key].length === 1
                            ? "transacción"
                            : "transacciones"}
                        </Text>
                      </View>
                    </View>
                    {/* Transacciones del grupo */}
                    {groupedData.data[key].map((alumno, index) => {
                      const fecha = alumno.fecha_transaction
                        ? new Date(alumno.fecha_transaction)
                        : null;
                      const añoActual = new Date().getFullYear();
                      const esAñoActual = fecha
                        ? fecha.getFullYear() === añoActual
                        : true;

                      return (
                        <View
                          key={alumno.id_transaccion || `\$\{key\}-\$\{index\}`}
                          className={`flex-row items-center border-t ${
                            esAñoActual
                              ? `border-slate-200 ${index % 2 ? "bg-white" : "bg-slate-50"}`
                              : "border-orange-200 bg-orange-50/30"
                          }`}
                        >
                          <TouchableOpacity
                            style={{ flexDirection: "row", flex: 11.5 }}
                            onPress={() => onRowClick && onRowClick(alumno)}
                          >
                            <Text
                              style={{ flex: 3 }}
                              className={`p-3 ${esAñoActual ? "text-slate-700" : "text-slate-600"}`}
                              numberOfLines={2}
                            >
                              {alumno.nombre_curso}
                            </Text>
                            <Text
                              style={{ flex: 3 }}
                              className={`p-3 ${esAñoActual ? "text-slate-800" : "text-slate-700"}`}
                              numberOfLines={1}
                            >
                              {alumno.nombre_alumno}
                            </Text>
                            <Text
                              style={{ flex: 1.5 }}
                              className={`p-3 font-medium ${esAñoActual ? "text-slate-700" : "text-slate-600"}`}
                            >
                              {currencyFormatter.format(
                                alumno.monto_pendiente || 0
                              )}
                            </Text>
                            <View style={{ flex: 1.5 }} className="p-3">
                              {alumno.fecha_transaction ? (
                                (() => {
                                  const fecha = new Date(
                                    alumno.fecha_transaction
                                  );
                                  const diaMes = fecha.toLocaleDateString(
                                    "es-MX",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                    }
                                  );

                                  return (
                                    <Text
                                      className={
                                        esAñoActual
                                          ? "text-slate-700"
                                          : "text-slate-600"
                                      }
                                      numberOfLines={1}
                                    >
                                      {diaMes}
                                    </Text>
                                  );
                                })()
                              ) : (
                                <Text className="text-slate-400">N/A</Text>
                              )}
                            </View>
                            <Text
                              style={{ flex: 1.5, marginLeft: 0 }}
                              className={`p-3 ${esAñoActual ? "text-slate-700" : "text-slate-600"}`}
                              numberOfLines={1}
                            >
                              {alumno.grupo}
                            </Text>
                          </TouchableOpacity>
                          <View
                            style={{ flex: 1 }}
                            className="p-3 flex-row justify-center items-center"
                          >
                            <TouchableOpacity onPress={() => onReprint(alumno)}>
                              <Svg
                                height="22"
                                viewBox="0 -960 960 960"
                                width="22"
                                fill="#475569"
                              >
                                <Path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z" />
                              </Svg>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                );
              })
            ) : (
              // Vista normal (año específico seleccionado)
              filtered.map((alumno, index) => {
                // Determinar si la transacción es del año actual
                const fecha = alumno.fecha_transaction
                  ? new Date(alumno.fecha_transaction)
                  : null;
                const añoActual = new Date().getFullYear();
                const esAñoActual = fecha
                  ? fecha.getFullYear() === añoActual
                  : true;

                return (
                  <View
                    key={alumno.id_transaccion || index}
                    className={`flex-row items-center border-t ${
                      esAñoActual
                        ? `border-slate-200 ${index % 2 ? "bg-white" : "bg-slate-50"}`
                        : "border-orange-200 bg-orange-50/30"
                    }`}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: "row", flex: 11.5 }}
                      onPress={() => onRowClick && onRowClick(alumno)}
                    >
                      <Text
                        style={{ flex: 3 }}
                        className={`p-3 ${esAñoActual ? "text-slate-700" : "text-slate-600"}`}
                        numberOfLines={2}
                      >
                        {alumno.nombre_curso}
                      </Text>
                      <Text
                        style={{ flex: 3 }}
                        className={`p-3 ${esAñoActual ? "text-slate-800" : "text-slate-700"}`}
                        numberOfLines={1}
                      >
                        {alumno.nombre_alumno}
                      </Text>
                      <Text
                        style={{ flex: 1.5 }}
                        className={`p-3 font-medium ${esAñoActual ? "text-slate-700" : "text-slate-600"}`}
                      >
                        {currencyFormatter.format(alumno.monto_pendiente || 0)}
                      </Text>
                      <View style={{ flex: 1.5 }} className="p-3">
                        {alumno.fecha_transaction ? (
                          (() => {
                            const fecha = new Date(alumno.fecha_transaction);
                            const añoActual = new Date().getFullYear();
                            const añoTransaccion = fecha.getFullYear();
                            const esAñoActual = añoTransaccion === añoActual;

                            const diaMes = fecha.toLocaleDateString("es-MX", {
                              day: "2-digit",
                              month: "short",
                            });

                            return (
                              <Text
                                className={
                                  esAñoActual
                                    ? "text-slate-700"
                                    : "text-slate-600"
                                }
                                numberOfLines={1}
                              >
                                {diaMes}
                              </Text>
                            );
                          })()
                        ) : (
                          <Text className="text-slate-400">N/A</Text>
                        )}
                      </View>
                      <Text
                        style={{ flex: 1.5, marginLeft: 0 }}
                        className={`p-3 ${esAñoActual ? "text-slate-700" : "text-slate-600"}`}
                        numberOfLines={1}
                      >
                        {alumno.grupo}
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{ flex: 1 }}
                      className="p-3 flex-row justify-center items-center"
                    >
                      <TouchableOpacity onPress={() => onReprint(alumno)}>
                        <Svg
                          height="22"
                          viewBox="0 -960 960 960"
                          width="22"
                          fill="#475569"
                        >
                          <Path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z" />
                        </Svg>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )
          ) : (
            <View className="p-8 items-center justify-center bg-white">
              <Text className="text-slate-500 text-center font-medium">
                {query
                  ? "No se encontraron resultados para tu búsqueda."
                  : "Aún no hay ventas con adeudos registradas."}
              </Text>
              <Text className="text-slate-400 text-center text-sm mt-1">
                {query
                  ? "Intenta con otras palabras clave."
                  : "¡Todo está al día!"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {isRefetching && (
        <View
          style={StyleSheet.absoluteFill}
          className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl"
        >
          <ActivityIndicator size="large" color="#6F09EA" />
        </View>
      )}
    </View>
  );
};

const StudentDetailsModal = ({
  visible,
  onClose,
  student,
  details,
  loading,
  onMakePayment, // Nueva prop para manejar el pago
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-[60%] shadow-2xl">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-slate-800">
              Detalles del Estudiante
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-slate-100 p-2 rounded-full"
            >
              <Svg
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                fill="#64748b"
              >
                <Path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </Svg>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#6F09EA" />
              <Text className="text-slate-500 mt-4">
                Cargando información...
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="bg-indigo-50 p-4 rounded-xl mb-6 border border-indigo-100">
                <Text className="text-sm text-indigo-600 font-semibold uppercase tracking-wider mb-1">
                  Estudiante
                </Text>
                <Text className="text-2xl font-bold text-indigo-900">
                  {student?.nombre_estudiante}
                </Text>
                <View className="flex-row items-center mt-2">
                  <View className="bg-white px-3 py-1 rounded-full border border-indigo-200 mr-2">
                    <Text className="text-indigo-700 font-medium text-xs">
                      {student?.grupo || "Sin grupo"}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-lg font-bold text-slate-800 mb-3">
                  Resumen Financiero
                </Text>
                <View className="flex-row gap-4">
                  <View className="flex-1 bg-red-50 p-4 rounded-xl border border-red-100">
                    <Text className="text-red-600 font-medium text-xs uppercase">
                      Deuda Total
                    </Text>
                    <Text className="text-2xl font-bold text-red-700 mt-1">
                      ${details?.deudaTotal?.toLocaleString("es-MX") || "0"}
                    </Text>
                  </View>
                  <View className="flex-1 bg-green-50 p-4 rounded-xl border border-green-100">
                    <Text className="text-green-600 font-medium text-xs uppercase">
                      Pagado
                    </Text>
                    <Text className="text-2xl font-bold text-green-700 mt-1">
                      ${details?.pagadoTotal?.toLocaleString("es-MX") || "0"}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mb-8">
                <Text className="text-lg font-bold text-slate-800 mb-3">
                  Cursos Inscritos
                </Text>
                {details?.cursos?.length > 0 ? (
                  details.cursos.map((curso, index) => (
                    <View
                      key={index}
                      className="bg-white border border-slate-200 p-4 rounded-xl mb-3 flex-row items-center justify-between shadow-sm"
                    >
                      <View className="flex-1">
                        <Text className="font-semibold text-slate-800 text-base">
                          {curso.nombre}
                        </Text>
                        {curso.fecha_transaction && (
                          <Text className="text-slate-500 text-xs mt-0.5">
                            Fecha de inscripción:{" "}
                            {new Date(
                              curso.fecha_transaction
                            ).toLocaleDateString("es-MX", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Text>
                        )}
                        {curso.pendiente > 0 ? (
                          <Text className="text-red-500 text-sm mt-1 font-medium">
                            Pendiente: $
                            {curso.pendiente.toLocaleString("es-MX")}
                          </Text>
                        ) : (
                          <Text className="text-green-600 text-sm mt-1 font-medium">
                            Pagado
                          </Text>
                        )}
                      </View>
                      {curso.pendiente > 0 && (
                        <TouchableOpacity
                          onPress={() => onMakePayment(curso)}
                          className="bg-indigo-100 px-4 py-2 rounded-full"
                        >
                          <Text className="text-indigo-700 font-bold text-sm">
                            Abonar
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                ) : (
                  <Text className="text-slate-500 italic">
                    No hay cursos registrados.
                  </Text>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const ScreenEstudiantes = ({ navigation }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formAnimation = useRef(new Animated.Value(0)).current;

  // Estados para el modal de detalles
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Estados para el modal de abono
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedCourseForPayment, setSelectedCourseForPayment] =
    useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Estado para el filtro de estatus
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const handleRefresh = async () => {
    if (isRefetching || loading) return;
    setIsRefetching(true);
    const { data, error } = await supabase
      .from("alumnos")
      .select(
        `
        id_alumno,
        nombre_alumno,
        grupo,
        estatus_alumno,
        cursos (nombre_curso)
      `
      )
      .order("id_alumno", { ascending: false });

    if (!error && data) {
      // Flatten the data structure for easier display
      const formattedData = data.map((item) => ({
        id_estudiante: item.id_alumno,
        nombre_estudiante: item.nombre_alumno,
        grupo: item.grupo,
        estatus_alumno: item.estatus_alumno,
        curso_asignado: item.cursos?.nombre_curso || "Sin curso",
      }));
      setEstudiantes(formattedData);
    }
    setTimeout(() => setIsRefetching(false), 300);
  };

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const fetchEstudiantes = async () => {
        if (isMounted) {
          if (estudiantes.length > 0) setIsRefetching(true);
          else setLoading(true);
        }

        const { data, error } = await supabase
          .from("alumnos")
          .select(
            `
            id_alumno,
            nombre_alumno,
            grupo,
            estatus_alumno,
            cursos (nombre_curso)
          `
          )
          .order("id_alumno", { ascending: false });

        if (isMounted) {
          if (!error && data) {
            const formattedData = data.map((item) => ({
              id_estudiante: item.id_alumno,
              nombre_estudiante: item.nombre_alumno,
              grupo: item.grupo,
              estatus_alumno: item.estatus_alumno,
              curso_asignado: item.cursos?.nombre_curso || "Sin curso",
            }));
            setEstudiantes(formattedData);
          }
          setLoading(false);
          setIsRefetching(false);
        }
      };

      fetchEstudiantes();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este estudiante?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("alumnos")
              .delete()
              .eq("id_alumno", id);
            if (error)
              Alert.alert("Error", "No se pudo eliminar el estudiante.");
            else handleRefresh();
          },
        },
      ]
    );
  };

  const handleEdit = (estudiante) => {
    console.log("Editando estudiante:", estudiante);
    // Aquí iría la lógica para mostrar el formulario de edición
  };

  const handleAdd = () => {
    setIsFormVisible(true);
    Animated.timing(formAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseForm = () => {
    Animated.timing(formAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsFormVisible(false);
      handleRefresh(); // Actualizar la lista después de cerrar
    });
  };

  const handleOpenPaymentModal = (curso) => {
    setSelectedCourseForPayment(curso);
    setPaymentAmount(0); // Inicializamos en 0
    setPaymentModalVisible(true);
  };

  const handleProcessPayment = async () => {
    const amount = Number(paymentAmount);
    if (amount <= 0) {
      Alert.alert("Error", "Por favor selecciona un monto válido.");
      return;
    }
    if (amount > selectedCourseForPayment.pendiente) {
      Alert.alert(
        "Error",
        "El monto del abono no puede ser mayor al saldo pendiente."
      );
      return;
    }

    setProcessingPayment(true);

    try {
      // 1. Buscar las transacciones pendientes para este estudiante y curso
      const { data: transactions, error: fetchError } = await supabase
        .from("transacciones")
        .select("*")
        .eq("alumno_id", selectedStudent.id_estudiante)
        .eq("curso_id", selectedCourseForPayment.id)
        .gt("pendiente", 0)
        .order("fecha_transaction", { ascending: true }); // Pagamos las más antiguas primero

      if (fetchError) throw fetchError;

      let remainingPayment = amount;
      const abonos = []; // Array para registrar los abonos

      // 2. Iterar y actualizar transacciones
      for (const transaction of transactions) {
        if (remainingPayment <= 0) break;

        const paymentForThisTransaction = Math.min(
          remainingPayment,
          transaction.pendiente
        );
        const newPendiente = transaction.pendiente - paymentForThisTransaction;

        // Actualizar pendiente en transacciones
        const { error: updateError } = await supabase
          .from("transacciones")
          .update({ pendiente: newPendiente })
          .eq("id_transaccion", transaction.id_transaccion);

        if (updateError) throw updateError;

        // Guardar info del abono para registrarlo en ingresos
        abonos.push({
          monto: paymentForThisTransaction,
          id_transaccion: transaction.id_transaccion,
        });

        remainingPayment -= paymentForThisTransaction;
      }

      // 3. Registrar el abono total en la tabla de ingresos
      const { error: ingresoError } = await supabase.from("ingresos").insert([
        {
          fecha_ingreso: new Date().toISOString().split("T")[0],
          monto_ingreso: amount,
          nombre_ingreso: selectedCourseForPayment.nombre,
          desc_ingreso: selectedStudent.nombre_estudiante,
        },
      ]);

      if (ingresoError) throw ingresoError;

      Alert.alert("Éxito", "Abono registrado correctamente.");
      setPaymentModalVisible(false);
      // Recargar detalles
      handleViewDetails(selectedStudent);
    } catch (error) {
      console.error("Error processing payment:", error);
      Alert.alert("Error", "Hubo un problema al procesar el abono.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleViewDetails = async (estudiante) => {
    setSelectedStudent(estudiante);
    setDetailsModalVisible(true);
    setLoadingDetails(true);

    try {
      const { data, error } = await supabase
        .from("transacciones")
        .select(
          `
          pendiente,
          total,
          anticipo,
          curso_id,
          fecha_transaction,
          cursos (nombre_curso)
        `
        )
        .eq("alumno_id", estudiante.id_estudiante);

      if (error) throw error;

      let deudaTotal = 0;
      let pagadoTotal = 0;
      const cursosMap = new Map();

      data.forEach((t) => {
        deudaTotal += t.pendiente || 0;
        pagadoTotal +=
          (t.anticipo || 0) +
          ((t.total || 0) - (t.pendiente || 0) - (t.anticipo || 0));

        if (t.curso_id && t.cursos) {
          if (!cursosMap.has(t.curso_id)) {
            cursosMap.set(t.curso_id, {
              id: t.curso_id,
              nombre: t.cursos.nombre_curso,
              pendiente: 0,
              fecha_transaction: t.fecha_transaction, // Guardar la primera fecha
            });
          }
          // Sumamos pendiente por curso si hay múltiples transacciones para el mismo curso
          const curso = cursosMap.get(t.curso_id);
          curso.pendiente += t.pendiente || 0;

          // Actualizar con la fecha más reciente
          if (
            t.fecha_transaction &&
            (!curso.fecha_transaction ||
              new Date(t.fecha_transaction) > new Date(curso.fecha_transaction))
          ) {
            curso.fecha_transaction = t.fecha_transaction;
          }
        }
      });

      setStudentDetails({
        deudaTotal,
        pagadoTotal,
        cursos: Array.from(cursosMap.values()),
      });
    } catch (err) {
      console.error("Error fetching student details:", err);
      Alert.alert(
        "Error",
        "No se pudieron cargar los detalles del estudiante."
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleStatusChange = async (estudiante) => {
    const nuevoEstatus = !estudiante.estatus_alumno;
    const estatusTexto = nuevoEstatus ? "activo" : "inactivo";

    Alert.alert(
      "Cambiar Estatus",
      `¿Deseas marcar a ${estudiante.nombre_estudiante} como ${estatusTexto}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("alumnos")
                .update({ estatus_alumno: nuevoEstatus })
                .eq("id_alumno", estudiante.id_estudiante);

              if (error) throw error;

              Alert.alert(
                "Éxito",
                `El estudiante ha sido marcado como ${estatusTexto}.`
              );

              // Refrescar la lista
              handleRefresh();
            } catch (error) {
              console.error("Error updating student status:", error);
              Alert.alert(
                "Error",
                "No se pudo actualizar el estatus del estudiante."
              );
            }
          },
        },
      ]
    );
  };

  const formContainerStyle = {
    transform: [
      {
        translateY: formAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [useWindowDimensions().height, 0],
        }),
      },
    ],
  };

  return (
    <View className="flex-1 bg-slate-50">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6F09EA" />
        </View>
      ) : (
        <>
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center bg-white border border-slate-300 rounded-full px-3 py-1 shadow-sm">
              <Svg
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="#9ca3af"
              >
                <Path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </Svg>
              <TextInput
                placeholder="Buscar estudiante..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="ml-2 text-base"
              />
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setShowOnlyActive(!showOnlyActive)}
                className={`p-2 rounded-full shadow-md flex-row items-center px-4 ${
                  showOnlyActive
                    ? "bg-green-600 shadow-green-600/30"
                    : "bg-slate-500 shadow-slate-500/30"
                }`}
              >
                <Svg
                  height="18"
                  viewBox="0 -960 960 960"
                  width="18"
                  fill="#ffffff"
                >
                  <Path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z" />
                </Svg>
                <Text className="text-white font-bold ml-2">
                  {showOnlyActive ? "Solo Activos" : "Todos"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAdd}
                className="bg-indigo-600 p-2 rounded-full shadow-md shadow-indigo-600/30 flex-row items-center px-4"
              >
                <Svg
                  height="18"
                  viewBox="0 -960 960 960"
                  width="18"
                  fill="#ffffff"
                >
                  <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </Svg>
                <Text className="text-white font-bold ml-2">
                  Agregar Estudiante
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TablaEstudiantes
            data={estudiantes}
            query={searchTerm}
            isRefetching={isRefetching}
            onRefresh={handleRefresh}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            showOnlyActive={showOnlyActive}
          />
        </>
      )}
      {isFormVisible && (
        <Animated.View
          style={[StyleSheet.absoluteFill, formContainerStyle]}
          className="absolute inset-0 z-10 bg-slate-50"
        >
          <RegistroEstudiantes
            navigation={navigation}
            onFormClose={handleCloseForm}
          />
        </Animated.View>
      )}

      <StudentDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        student={selectedStudent}
        details={studentDetails}
        loading={loadingDetails}
        onMakePayment={handleOpenPaymentModal}
      />

      {/* Modal simple para ingresar abono */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <Text className="text-xl font-bold text-slate-800 mb-2">
              Registrar Abono
            </Text>
            <Text className="text-slate-600 mb-4">
              Curso: {selectedCourseForPayment?.nombre}
            </Text>
            <Text className="text-slate-500 text-sm mb-2">
              Pendiente actual: $
              {selectedCourseForPayment?.pendiente.toLocaleString("es-MX")}
            </Text>

            <View className="items-center mb-6">
              <Text className="text-4xl font-bold text-indigo-600 mb-4">
                ${Math.round(paymentAmount).toLocaleString("es-MX")}
              </Text>

              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={selectedCourseForPayment?.pendiente || 0}
                step={10} // Pasos de $10
                value={Number(paymentAmount)}
                onSlidingComplete={(val) => setPaymentAmount(val)}
                minimumTrackTintColor="#4f46e5"
                maximumTrackTintColor="#cbd5e1"
                thumbTintColor="#4f46e5"
              />

              <View className="flex-row flex-wrap justify-center gap-2 mt-4">
                {(() => {
                  const total = selectedCourseForPayment?.pendiente || 0;

                  // Función para redondear al múltiplo de 5 o 10 más cercano
                  const roundToNice = (num) => {
                    if (num <= 10) return Math.round(num / 5) * 5;
                    if (num <= 50) return Math.round(num / 10) * 10;
                    if (num <= 100) return Math.round(num / 20) * 20;
                    return Math.round(num / 50) * 50;
                  };

                  const amounts = [
                    roundToNice(total * 0.33),
                    roundToNice(total * 0.66),
                    total,
                  ].filter((val, idx, arr) => arr.indexOf(val) === idx); // Eliminar duplicados

                  return amounts.map((amount, idx) => {
                    const isTotal = amount === total;
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setPaymentAmount(amount)}
                        className={`px-3 py-1 rounded-full border ${
                          paymentAmount === amount
                            ? "bg-indigo-100 border-indigo-500"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            paymentAmount === amount
                              ? "text-indigo-700"
                              : "text-slate-600"
                          }`}
                        >
                          {isTotal
                            ? "Total"
                            : `$${amount.toLocaleString("es-MX")}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  });
                })()}
              </View>
            </View>

            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={() => setPaymentModalVisible(false)}
                className="px-4 py-2 rounded-lg bg-slate-100"
                disabled={processingPayment}
              >
                <Text className="text-slate-600 font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleProcessPayment}
                className="px-4 py-2 rounded-lg bg-indigo-600"
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-semibold">Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const TablaEstudiantes = ({
  data,
  query,
  isRefetching,
  onRefresh,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange, // Nueva prop para cambiar estatus
  showOnlyActive = true, // Nueva prop para filtrar por estatus
}) => {
  const [sortKey, setSortKey] = useState("nombre_estudiante");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = data.filter((r) => {
      // Filtrar por estatus si showOnlyActive está activado
      if (showOnlyActive && !r.estatus_alumno) return false;

      if (!q) return true;
      return (
        String(r.nombre_estudiante).toLowerCase().includes(q) ||
        String(r.curso_asignado).toLowerCase().includes(q) ||
        String(r.grupo).toLowerCase().includes(q)
      );
    });
    const sorted = [...arr].sort((a, b) => {
      let va = a[sortKey] ?? "";
      let vb = b[sortKey] ?? "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, query, sortKey, sortDir, showOnlyActive]);

  const SortHeader = ({ label, k, flex = 1, center }) => (
    <Pressable
      onPress={() => {
        if (!k) return;
        setSortKey(k);
        setSortDir((d) =>
          sortKey === k ? (d === "asc" ? "desc" : "asc") : "asc"
        );
      }}
      className="py-3 px-3"
      style={{ flex, alignItems: center ? "center" : "flex-start" }}
      android_ripple={{ color: "rgba(0,0,0,0.05)" }}
    >
      <View className="flex-row items-center gap-1">
        <Text className="text-slate-800 font-semibold text-xs sm:text-sm uppercase tracking-wide">
          {label}
        </Text>
        {sortKey === k && (
          <Svg width={12} height={12} viewBox="0 -960 960 960" fill="#334155">
            {sortDir === "asc" ? (
              <Path d="M480-680 240-440h480L480-680Z" />
            ) : (
              <Path d="M240-520h480L480-280 240-520Z" />
            )}
          </Svg>
        )}
      </View>
    </Pressable>
  );

  return (
    <View className="px-2 flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor="#6F09EA"
          />
        }
      >
        <View className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <View className="bg-slate-100 border-b border-slate-200 flex-row">
            <SortHeader label="Nombre" k="nombre_estudiante" flex={4} />
            <SortHeader label="Último Curso" k="curso_asignado" flex={3} />
            <SortHeader label="Grupo" k="grupo" flex={2} center />
            <SortHeader label="Estatus" k="estatus_alumno" flex={1.5} center />
            <SortHeader label="" k={null} flex={1.5} center />
          </View>
          {filtered.length > 0 ? (
            filtered.map((estudiante, index) => (
              <View
                key={estudiante.id_alumno || index}
                className={`flex-row items-center border-t border-slate-200 ${index % 2 ? "bg-white" : "bg-slate-50"}`}
              >
                <TouchableOpacity
                  style={{ flex: 10.5, flexDirection: "row" }}
                  onPress={() => onViewDetails(estudiante)}
                >
                  <Text
                    style={{ flex: 4 }}
                    className="p-3 text-slate-800"
                    numberOfLines={1}
                  >
                    {estudiante.nombre_estudiante}
                  </Text>
                  <Text
                    style={{ flex: 3 }}
                    className="p-3 text-slate-700"
                    numberOfLines={1}
                  >
                    {estudiante.curso_asignado}
                  </Text>
                  <Text
                    style={{ flex: 2, textAlign: "center" }}
                    className="p-3 text-slate-700"
                  >
                    {estudiante.grupo}
                  </Text>
                </TouchableOpacity>
                {/* Columna de Estatus */}
                <View
                  style={{ flex: 1.5 }}
                  className="p-3 flex-row justify-center items-center"
                >
                  <TouchableOpacity
                    onPress={() => onStatusChange(estudiante)}
                    className="p-2"
                  >
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: estudiante.estatus_alumno
                          ? "#22c55e"
                          : "#ef4444",
                        borderWidth: 2,
                        borderColor: estudiante.estatus_alumno
                          ? "#16a34a"
                          : "#dc2626",
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{ flex: 1.5 }}
                  className="p-3 flex-row justify-center items-center gap-x-4"
                >
                  <TouchableOpacity
                    onPress={() => onDelete(estudiante.id_estudiante)}
                  >
                    <Svg
                      height="22"
                      viewBox="0 -960 960 960"
                      width="22"
                      fill="#ef4444"
                    >
                      <Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View className="p-8 items-center justify-center bg-white">
              <Text className="text-slate-500 text-center font-medium">
                {query
                  ? "No se encontraron resultados para tu búsqueda."
                  : "Aún no hay estudiantes registrados."}
              </Text>
              <Text className="text-slate-400 text-center text-sm mt-1">
                {query
                  ? "Intenta con otras palabras clave."
                  : "¡Agrega un nuevo estudiante para comenzar!"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {isRefetching && (
        <View
          style={StyleSheet.absoluteFill}
          className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl"
        >
          <ActivityIndicator size="large" color="#6F09EA" />
        </View>
      )}
    </View>
  );
};

const ScreenAsesores = () => {
  const [asesores, setAsesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para el formulario y la animación
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingAsesor, setEditingAsesor] = useState(null);
  const formAnimation = useRef(new Animated.Value(0)).current;

  const handleRefresh = async () => {
    if (isRefetching || loading) return;
    setIsRefetching(true);
    const { data, error } = await supabase
      .from("asesores")
      .select("*")
      .order("id_asesor", { ascending: false });
    if (!error && data) {
      setAsesores(data);
    }
    setTimeout(() => setIsRefetching(false), 300);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAsesores = async () => {
        // Si ya hay datos, mostramos el indicador de "refetching", si no, el de carga inicial
        if (asesores.length > 0) {
          setIsRefetching(true);
        } else {
          setLoading(true);
        }
        const { data, error } = await supabase
          .from("asesores")
          .select("*")
          .order("id_asesor", { ascending: false });
        if (!error && data) setAsesores(data);
        setLoading(false);
        setIsRefetching(false);
      };
      fetchAsesores();
    }, [])
  );

  const handleDelete = (id_asesor) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este asesor?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("asesores")
              .delete()
              .eq("id_asesor", id_asesor);
            if (error) {
              Alert.alert("Error", "No se pudo eliminar el asesor.");
            } else {
              handleRefresh(); // Recargamos la lista
            }
          },
        },
      ]
    );
  };

  const handleOpenForm = (asesor = null) => {
    setEditingAsesor(asesor);
    setIsFormVisible(true);
    Animated.timing(formAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseForm = (formHasUnsavedChanges = false) => {
    const closeAction = () => {
      Animated.timing(formAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsFormVisible(false);
        setEditingAsesor(null);
        handleRefresh();
      });
    };

    if (formHasUnsavedChanges) {
      Alert.alert(
        "Cambios sin guardar",
        "Tienes cambios sin guardar. ¿Deseas descartarlos?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Descartar",
            style: "destructive",
            onPress: closeAction,
          },
        ]
      );
    } else {
      closeAction();
    }
  };

  const { height } = useWindowDimensions();
  const formContainerStyle = {
    transform: [
      {
        translateY: formAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [useWindowDimensions().height, 0],
        }),
      },
    ],
  };

  // Vista de la tabla de asesores
  return (
    <View className="flex-1 bg-slate-50 relative">
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center bg-white border border-slate-300 rounded-full px-3 py-1 shadow-sm">
          <Svg height="20" viewBox="0 -960 960 960" width="20" fill="#9ca3af">
            <Path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </Svg>
          <TextInput
            placeholder="Buscar asesor..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            className="ml-2 text-base"
          />
        </View>
        <TouchableOpacity
          onPress={() => handleOpenForm()}
          className="bg-indigo-600 p-2 rounded-full shadow-md shadow-indigo-600/30 flex-row items-center px-4"
        >
          <Svg height="18" viewBox="0 -960 960 960" width="18" fill="#ffffff">
            <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </Svg>
          <Text className="text-white font-bold ml-2">Agregar Asesor</Text>
        </TouchableOpacity>
      </View>

      <TablaAsesores
        data={asesores}
        loading={loading}
        query={searchTerm}
        isRefetching={isRefetching}
        onRefresh={handleRefresh}
        onEdit={handleOpenForm}
        onDelete={handleDelete}
        onView={handleOpenForm}
      />
      {isFormVisible && (
        <Animated.View
          style={[StyleSheet.absoluteFill, formContainerStyle]}
          className="absolute inset-0 z-10 bg-slate-50"
        >
          <RegistroAsesor
            key={editingAsesor ? `edit-${editingAsesor.id_asesor}` : "new"}
            asesorToEdit={editingAsesor}
            onFormClose={handleCloseForm}
          />
        </Animated.View>
      )}
    </View>
  );
};

const TablaAsesores = ({
  data,
  loading = false,
  query,
  isRefetching,
  onRefresh,
  onEdit,
  onDelete,
  onView,
}) => {
  const [sortKey, setSortKey] = useState("nombre_asesor");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = data.filter((r) => {
      if (!q) return true;
      return (
        String(r.nombre_asesor).toLowerCase().includes(q) ||
        String(r.correo_asesor).toLowerCase().includes(q) ||
        String(r.telefono_asesor).toLowerCase().includes(q)
      );
    });
    const sorted = [...arr].sort((a, b) => {
      let va = a[sortKey] ?? "";
      let vb = b[sortKey] ?? "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, query, sortKey, sortDir]);

  const SortHeader = ({ label, k, flex = 1, center }) => (
    <Pressable
      onPress={() => {
        if (!k) return;
        setSortKey(k);
        setSortDir((d) =>
          sortKey === k ? (d === "asc" ? "desc" : "asc") : "asc"
        );
      }}
      className="py-3 px-3"
      style={{ flex, alignItems: center ? "center" : "flex-start" }}
      android_ripple={{ color: "rgba(0,0,0,0.05)" }}
    >
      <View className="flex-row items-center gap-1">
        <Text className="text-slate-800 font-semibold text-xs sm:text-sm uppercase tracking-wide">
          {label}
        </Text>
        {sortKey === k && (
          <Svg width={12} height={12} viewBox="0 -960 960 960" fill="#334155">
            {sortDir === "asc" ? (
              <Path d="M480-680 240-440h480L480-680Z" />
            ) : (
              <Path d="M240-520h480L480-280 240-520Z" />
            )}
          </Svg>
        )}
      </View>
    </Pressable>
  );

  return (
    <View className={`px-2 pb-4 relative flex-1`}>
      <View
        className={`rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm ${Platform.OS == "web" ? "flex-1" : ""}`}
        style={{ opacity: loading || isRefetching ? 0.5 : 1 }}
      >
        <ScrollView
          stickyHeaderIndices={[0]}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              tintColor="#6F09EA"
            />
          }
        >
          <View className="bg-slate-100 border-b border-slate-200 flex-row">
            <SortHeader label="Nombre" k="nombre_asesor" flex={3} />
            <SortHeader label="Correo" k="correo_asesor" flex={5} />
            <SortHeader label="Teléfono" k="telefono_asesor" flex={2} />
            <SortHeader label="Acciones" k={null} flex={1.3} center />
          </View>

          {filtered.length > 0 ? (
            filtered.map((asesor, index) => (
              <Pressable
                key={asesor.id_asesor}
                className={`flex-row items-center ${index % 2 ? "bg-white" : "bg-slate-50"}`}
                android_ripple={{ color: "rgba(0,0,0,0.04)" }}
              >
                <View style={{ flex: 3 }} className="py-3 px-3">
                  <Text
                    numberOfLines={1}
                    className="text-slate-800 font-medium"
                  >
                    {asesor.nombre_asesor}
                  </Text>
                </View>
                <View style={{ flex: 5 }} className="py-3 px-3">
                  <Text numberOfLines={1} className="text-slate-700">
                    {asesor.correo_asesor}
                  </Text>
                </View>
                <View style={{ flex: 2 }} className="py-3 px-3">
                  <Text numberOfLines={1} className="text-slate-700">
                    {asesor.telefono_asesor}
                  </Text>
                </View>
                <View style={{ flex: 1.3 }} className="py-3 px-3">
                  <View className="flex flex-row items-center justify-around">
                    <TouchableOpacity onPress={() => onEdit(asesor)}>
                      <Svg
                        height="22"
                        viewBox="0 -960 960 960"
                        width="22"
                        fill="#3b82f6"
                      >
                        <Path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 23 56.5T849-602l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
                      </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onDelete(asesor.id_asesor)}
                    >
                      <Svg
                        height="22"
                        viewBox="0 -960 960 960"
                        width="22"
                        fill="#ef4444"
                      >
                        <Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <View className="p-8 items-center justify-center bg-white">
              <Text className="text-slate-500 text-center font-medium">
                {query
                  ? "No se encontraron asesores para tu búsqueda."
                  : "Aún no hay asesores registrados."}
              </Text>
              <Text className="text-slate-400 text-center text-sm mt-1">
                {query
                  ? "Intenta con otras palabras clave."
                  : "¡Agrega un nuevo asesor para comenzar!"}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
      {(loading || isRefetching) && (
        <View
          style={StyleSheet.absoluteFill}
          className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl"
        >
          <ActivityIndicator size="large" color="#6F09EA" />
        </View>
      )}
    </View>
  );
};

const ScreenPagos = ({ navigation }) => {
  const [copiado, setCopiado] = useState(false); //Esta es la funcion que necesito modificar
  const [isRedirecting, setIsRedirecting] = useState(false);

  const copiarDatos = async (e) => {
    await Clipboard.setStringAsync(e);
    setCopiado(true);
    setTimeout(() => {
      setCopiado(false);
    }, 1500);
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      // Resetea el estado de carga cuando la pantalla vuelve a tener foco
      setIsRedirecting(false);
    }, [])
  );

  const handleRedirectToVentas = () => {
    setIsRedirecting(true);
    // Pequeño delay para que el usuario vea el modal de carga
    setTimeout(() => navigation.navigate("Inicio", { screen: "Venta" }), 500);
  };

  const datosBancarios = {
    banco: "Bancoppel",
    beneficiario: "Kelvin Valentin Gomez Ramirez",
    cuenta: "4169 1608 5392 8977",
    clabe: "137628103732170052",
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: copiado ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [copiado]);

  return (
    <Tab.Navigator
      initialRouteName="Transferencia SPEI / Depósito"
      tabBarPosition="top"
      screenOptions={{
        tabBarActiveTintColor: "#1f1f1f",
        tabBarInactiveTintColor: "#70757a",

        tabBarScrollEnabled: false,
        tabBarItemStyle: { flex: 1 },
        tabBarLabelStyle: {
          fontSize: 14,
          textAlign: "center",
          fontWeight: "bold",
          textTransform: "uppercase",
        },
        tabBarStyle: { backgroundColor: "#f8fafc" },
        tabBarIndicatorStyle: { backgroundColor: "#1f1f1f", height: 2 },
      }}
    >
      <Tab.Screen name="Transferencia SPEI / Depósito">
        {() => (
          <View className="flex-1 p-6 flex-col justify-start items-center bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header con gradiente */}
            <View className="w-full max-w-[800px] mb-6">
              <View
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  borderRadius: 20,
                  padding: 24,
                  shadowColor: "#3b82f6",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 12,
                }}
                className="bg-blue-600"
              >
                <View className="flex-row items-center gap-3">
                  <View className="bg-white/20 rounded-full p-3">
                    <Svg
                      height="28"
                      viewBox="0 -960 960 960"
                      width="28"
                      fill="white"
                    >
                      <Path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" />
                    </Svg>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-2xl font-bold">
                      Datos Bancarios
                    </Text>
                    <Text className="text-white/80 text-sm mt-1">
                      Realiza tu transferencia de forma segura
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Grid de datos bancarios */}
            <View className="w-full max-w-[800px] mb-6">
              <View className="flex-row gap-4 mb-4">
                {/* Card Banco */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 6,
                    borderTopWidth: 4,
                    borderTopColor: "#3b82f6",
                  }}
                >
                  <View className="flex-row items-center gap-2 mb-3">
                    <Svg
                      height="20"
                      viewBox="0 -960 960 960"
                      width="20"
                      fill="#3b82f6"
                    >
                      <Path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" />
                    </Svg>
                    <Text className="text-slate-500 text-sm font-semibold uppercase">
                      Banco
                    </Text>
                  </View>
                  <Text className="text-slate-800 text-xl font-bold">
                    {datosBancarios.banco}
                  </Text>
                </View>

                {/* Card Beneficiario */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 6,
                    borderTopWidth: 4,
                    borderTopColor: "#10b981",
                  }}
                >
                  <View className="flex-row items-center gap-2 mb-3">
                    <Svg
                      height="20"
                      viewBox="0 -960 960 960"
                      width="20"
                      fill="#10b981"
                    >
                      <Path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
                    </Svg>
                    <Text className="text-slate-500 text-sm font-semibold uppercase">
                      Beneficiario
                    </Text>
                  </View>
                  <Text className="text-slate-800 text-xl font-bold">
                    {datosBancarios.beneficiario}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-4">
                {/* Card Número de Cuenta */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 6,
                    borderTopWidth: 4,
                    borderTopColor: "#8b5cf6",
                  }}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-2">
                      <Svg
                        height="20"
                        viewBox="0 -960 960 960"
                        width="20"
                        fill="#8b5cf6"
                      >
                        <Path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm178-80h444-444Zm0 0h444L480-830 258-720Z" />
                      </Svg>
                      <Text className="text-slate-500 text-sm font-semibold uppercase">
                        Número de Cuenta
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => copiarDatos(datosBancarios.cuenta)}
                      style={{
                        backgroundColor: "#f3f4f6",
                        borderRadius: 8,
                        padding: 8,
                      }}
                    >
                      <Svg
                        height="18"
                        viewBox="0 -960 960 960"
                        width="18"
                        fill="#6b7280"
                      >
                        <Path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  <Text className="text-slate-800 text-2xl font-bold tracking-wider">
                    {datosBancarios.cuenta}
                  </Text>
                  <Text className="text-slate-400 text-xs mt-2">
                    Toca el icono para copiar
                  </Text>
                </View>

                {/* Card CLABE */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 6,
                    borderTopWidth: 4,
                    borderTopColor: "#f59e0b",
                  }}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-2">
                      <Svg
                        height="20"
                        viewBox="0 -960 960 960"
                        width="20"
                        fill="#f59e0b"
                      >
                        <Path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" />
                      </Svg>
                      <Text className="text-slate-500 text-sm font-semibold uppercase">
                        CLABE
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => copiarDatos(datosBancarios.clabe)}
                      style={{
                        backgroundColor: "#f3f4f6",
                        borderRadius: 8,
                        padding: 8,
                      }}
                    >
                      <Svg
                        height="18"
                        viewBox="0 -960 960 960"
                        width="18"
                        fill="#6b7280"
                      >
                        <Path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  <Text className="text-slate-800 text-2xl font-bold tracking-wider">
                    {datosBancarios.clabe}
                  </Text>
                  <Text className="text-slate-400 text-xs mt-2">
                    Toca el icono para copiar
                  </Text>
                </View>
              </View>
            </View>

            {/* Instrucciones */}
            <View className="w-full max-w-[800px]">
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 16,
                  padding: 24,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <View className="flex-row items-center gap-3 mb-6">
                  <View className="bg-blue-100 rounded-full p-3">
                    <Svg
                      height="24"
                      viewBox="0 -960 960 960"
                      width="24"
                      fill="#3b82f6"
                    >
                      <Path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z" />
                    </Svg>
                  </View>
                  <Text className="text-slate-800 text-xl font-bold">
                    Instrucciones de Pago
                  </Text>
                </View>

                <View className="gap-4 mb-6">
                  {/* Paso 1 */}
                  <View className="flex-row items-start gap-4 bg-blue-50 p-4 rounded-xl">
                    <View
                      style={{
                        backgroundColor: "#3b82f6",
                        borderRadius: 20,
                        width: 32,
                        height: 32,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text className="text-white font-bold text-base">1</Text>
                    </View>
                    <Text className="text-slate-700 flex-1 text-base leading-6 pt-1">
                      Realiza una transferencia SPEI o depósito al número de
                      cuenta/CLABE
                    </Text>
                  </View>

                  {/* Paso 2 */}
                  <View className="flex-row items-start gap-4 bg-blue-50 p-4 rounded-xl">
                    <View
                      style={{
                        backgroundColor: "#3b82f6",
                        borderRadius: 20,
                        width: 32,
                        height: 32,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text className="text-white font-bold text-base">2</Text>
                    </View>
                    <Text className="text-slate-700 flex-1 text-base leading-6 pt-1">
                      Asegúrate de incluir tu nombre completo en la referencia o
                      concepto de pago
                    </Text>
                  </View>

                  {/* Paso 3 */}
                  <View className="flex-row items-start gap-4 bg-blue-50 p-4 rounded-xl">
                    <View
                      style={{
                        backgroundColor: "#3b82f6",
                        borderRadius: 20,
                        width: 32,
                        height: 32,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text className="text-white font-bold text-base">3</Text>
                    </View>
                    <Text className="text-slate-700 flex-1 text-base leading-6 pt-1">
                      Sube tu comprobante de transferencia para validación
                      rápida
                    </Text>
                  </View>
                </View>

                {/* Botón de acción */}
                <Pressable
                  onPress={handleRedirectToVentas}
                  style={({ pressed }) => ({
                    backgroundColor: "#3b82f6",
                    borderRadius: 12,
                    padding: 16,
                    opacity: pressed ? 0.8 : 1,
                    shadowColor: "#3b82f6",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  })}
                >
                  <View className="flex-row items-center justify-center gap-2">
                    <Svg
                      height="20"
                      viewBox="0 -960 960 960"
                      width="20"
                      fill="white"
                    >
                      <Path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" />
                    </Svg>
                    <Text className="text-white font-bold text-base">
                      Registrar Venta
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Toast de copiado */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                backgroundColor: "#10b981",
                padding: 16,
                borderRadius: 12,
                position: "absolute",
                bottom: 40,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Svg height="20" viewBox="0 -960 960 960" width="20" fill="white">
                <Path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
              </Svg>
              <Text className="text-white font-semibold">
                Copiado correctamente
              </Text>
            </Animated.View>

            {/* Modal de carga */}
            <Modal transparent visible={isRedirecting} animationType="fade">
              <View className="flex-1 justify-center items-center bg-black/60">
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 24,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 12,
                  }}
                >
                  <View className="flex-row items-center gap-4">
                    <ActivityIndicator size="large" color="#6F09EA" />
                    <Text className="text-slate-700 font-semibold text-base">
                      Cargando...
                    </Text>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen name="Efectivo">
        {() => (
          <ScrollView
            contentContainerStyle={{
              flexDirection: "column",
              alignItems: "center",
              padding: 24,
            }}
            className="bg-gradient-to-br from-slate-50 to-slate-100"
          >
            {/* Header con gradiente */}
            <View className="w-full max-w-[900px] mb-6">
              <View
                style={{
                  background:
                    "linear-gradient(135deg, #6F09EA 0%, #8B5CF6 100%)",
                  borderRadius: 20,
                  padding: 24,
                  shadowColor: "#6F09EA",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 12,
                }}
                className="bg-purple-600"
              >
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="bg-white/20 rounded-full p-3">
                    <Svg
                      height="28"
                      viewBox="0 -960 960 960"
                      width="28"
                      fill="white"
                    >
                      <Path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                    </Svg>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-2xl font-bold">
                      Punto de Pago MQerKAcademy
                    </Text>
                    <Text className="text-white/80 text-sm mt-1">
                      Visítanos en nuestra ubicación oficial
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Contenedor principal con dos columnas */}
            <View className="w-full max-w-[900px] flex-row gap-4 mb-6">
              {/* Columna izquierda - Información de contacto */}
              <View className="flex-1 gap-4">
                {/* Card de Dirección */}
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 6,
                    borderLeftWidth: 4,
                    borderLeftColor: "#6F09EA",
                  }}
                >
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="bg-purple-100 rounded-full p-2">
                      <Svg
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                        fill="#6F09EA"
                      >
                        <Path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                      </Svg>
                    </View>
                    <Text className="text-slate-800 text-lg font-bold">
                      Dirección
                    </Text>
                  </View>
                  <Text className="text-slate-600 text-base leading-6">
                    Calle Juárez entre Av. Independencia y 5 de Mayo
                  </Text>
                  <Text className="text-slate-600 text-base leading-6">
                    En altos de COMPUMAX
                  </Text>
                  <Text className="text-slate-600 text-base leading-6">
                    Tuxtepec, Oaxaca • C.P. 68300
                  </Text>
                </View>

                {/* Card de Horario */}
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 6,
                    borderLeftWidth: 4,
                    borderLeftColor: "#10b981",
                  }}
                >
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="bg-green-100 rounded-full p-2">
                      <Svg
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                        fill="#10b981"
                      >
                        <Path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
                      </Svg>
                    </View>
                    <Text className="text-slate-800 text-lg font-bold">
                      Horario
                    </Text>
                  </View>
                  <Text className="text-slate-600 text-base">
                    Lunes a Viernes
                  </Text>
                  <Text className="text-green-600 text-lg font-semibold">
                    9:00 AM - 5:00 PM
                  </Text>
                </View>

                {/* Card de Contacto */}
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 6,
                    borderLeftWidth: 4,
                    borderLeftColor: "#3b82f6",
                  }}
                >
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="bg-blue-100 rounded-full p-2">
                      <Svg
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                        fill="#3b82f6"
                      >
                        <Path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" />
                      </Svg>
                    </View>
                    <Text className="text-slate-800 text-lg font-bold">
                      Contacto
                    </Text>
                  </View>
                  <Text className="text-blue-600 text-xl font-semibold">
                    287 151 5760
                  </Text>
                </View>
              </View>

              {/* Columna derecha - Documentación */}
              <View className="flex-1">
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 24,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  <View className="flex-row items-center gap-3 mb-6">
                    <View
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        borderRadius: 12,
                        padding: 12,
                      }}
                      className="bg-green-500"
                    >
                      <Svg
                        height="28"
                        viewBox="0 -960 960 960"
                        width="28"
                        fill="white"
                      >
                        <Path d="M319-250h322v-60H319v60Zm0-170h322v-60H319v60ZM220-80q-24 0-42-18t-18-42v-680q0-24 18-42t42-18h361l219 219v521q0 24-18 42t-42 18H220Zm331-554v-186H220v680h520v-494H551ZM220-820v186-186 680-680Z" />
                      </Svg>
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-800 text-xl font-bold">
                        Documentación Requerida
                      </Text>
                      <Text className="text-slate-500 text-sm">
                        Para procesar tu pago
                      </Text>
                    </View>
                  </View>

                  <View className="gap-4">
                    {/* Item 1 */}
                    <View className="flex-row items-start gap-3 bg-slate-50 p-4 rounded-xl">
                      <View className="bg-green-500 rounded-full p-1 mt-0.5">
                        <Svg
                          height="16"
                          viewBox="0 -960 960 960"
                          width="16"
                          fill="white"
                        >
                          <Path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </Svg>
                      </View>
                      <Text className="text-slate-700 flex-1 text-base leading-6">
                        Documento de identificación oficial (INE, pasaporte)
                      </Text>
                    </View>

                    {/* Item 2 */}
                    <View className="flex-row items-start gap-3 bg-slate-50 p-4 rounded-xl">
                      <View className="bg-green-500 rounded-full p-1 mt-0.5">
                        <Svg
                          height="16"
                          viewBox="0 -960 960 960"
                          width="16"
                          fill="white"
                        >
                          <Path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </Svg>
                      </View>
                      <Text className="text-slate-700 flex-1 text-base leading-6">
                        Comprobante de domicilio reciente
                      </Text>
                    </View>

                    {/* Item 3 */}
                    <View className="flex-row items-start gap-3 bg-slate-50 p-4 rounded-xl">
                      <View className="bg-green-500 rounded-full p-1 mt-0.5">
                        <Svg
                          height="16"
                          viewBox="0 -960 960 960"
                          width="16"
                          fill="white"
                        >
                          <Path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </Svg>
                      </View>
                      <Text className="text-slate-700 flex-1 text-base leading-6">
                        Consultar sobre descuentos y promociones disponibles
                      </Text>
                    </View>
                  </View>

                  {/* Banner informativo */}
                  <View
                    style={{
                      backgroundColor: "#eff6ff",
                      borderRadius: 12,
                      padding: 16,
                      marginTop: 20,
                      borderWidth: 1,
                      borderColor: "#bfdbfe",
                    }}
                  >
                    <View className="flex-row items-center gap-2">
                      <Svg
                        height="20"
                        viewBox="0 -960 960 960"
                        width="20"
                        fill="#3b82f6"
                      >
                        <Path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                      </Svg>
                      <Text className="text-blue-700 text-sm font-medium flex-1">
                        Nuestro personal te asistirá en todo el proceso
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Sección de imágenes de ubicación */}
            <View className="w-full max-w-[900px]">
              <View className="mb-4">
                <View className="flex-row items-center gap-2 mb-2">
                  <Svg
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    fill="#6F09EA"
                  >
                    <Path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360v80H200v560h560v-360h80v360q0 33-23.5 56.5T760-120H200Zm120-160 56-56-64-64h168v-80H312l64-64-56-56-160 160 160 160Zm344-320v-120H544v-80h120v-120h80v120h120v80H744v120h-80Z" />
                  </Svg>
                  <Text className="text-slate-800 text-xl font-bold">
                    Cómo Llegar
                  </Text>
                </View>
                <Text className="text-slate-600 text-sm mb-4">
                  Encuentra nuestra ubicación fácilmente
                </Text>
              </View>

              <View className="flex-row gap-4">
                {/* Imagen de Localización */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <View className="flex-row items-center gap-2 mb-3">
                    <View className="bg-blue-100 rounded-full p-2">
                      <Svg
                        height="20"
                        viewBox="0 -960 960 960"
                        width="20"
                        fill="#3b82f6"
                      >
                        <Path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                      </Svg>
                    </View>
                    <Text className="text-slate-800 font-bold">
                      Mapa de Ubicación
                    </Text>
                  </View>
                  <View
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      borderWidth: 2,
                      borderColor: "#e2e8f0",
                    }}
                  >
                    <Image
                      source={require("./assets/Ubicacion/Localizacion-MQerKAcademy.jpg")}
                      style={{
                        width: "100%",
                        height: 300,
                      }}
                      resizeMode="cover"
                    />
                  </View>
                </View>

                {/* Imagen de Foto Referencia */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <View className="flex-row items-center gap-2 mb-3">
                    <View className="bg-purple-100 rounded-full p-2">
                      <Svg
                        height="20"
                        viewBox="0 -960 960 960"
                        width="20"
                        fill="#6F09EA"
                      >
                        <Path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                      </Svg>
                    </View>
                    <Text className="text-slate-800 font-bold">
                      Foto de Referencia
                    </Text>
                  </View>
                  <View
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      borderWidth: 2,
                      borderColor: "#e2e8f0",
                    }}
                  >
                    <Image
                      source={require("./assets/Ubicacion/Foto-Referencia_MQerKAcademy.jpeg")}
                      style={{
                        width: "100%",
                        height: 300,
                      }}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </Tab.Screen>
      <Tab.Screen name="Tarjeta de crédito / débito">
        {() => <PagoTarjetaStripe />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

function LabeledInput({ label, error, children, containerClassName = "" }) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      className={`w-full ${containerClassName}`}
    >
      <Text className="text-slate-700 text-xs font-semibold mb-1 uppercase tracking-wide">
        {label}
      </Text>
      {children}
      {!!error && <Text className="text-red-600 text-xs mt-1">{error}</Text>}
    </TouchableOpacity>
  );
}

const renderDropdownIcon = () => (
  <Svg height="20" viewBox="0 -960 960 960" width="20" fill="#475569">
    <Path d="M480-360 240-600h480L480-360Z" />
  </Svg>
);

const RegistroEgreso = ({ egresoToEdit, onFormClose }) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // --- Lógica para los inputs de fecha segmentados ---
  const [isDateEditable, setIsDateEditable] = useState(false);
  const [dateParts, setDateParts] = useState(() => {
    const initialDate = egresoToEdit?.fecha_egreso
      ? new Date(egresoToEdit.fecha_egreso + "T00:00:00") // Asegurar que se interprete como local
      : new Date();
    return {
      day: String(initialDate.getDate()).padStart(2, "0"),
      month: String(initialDate.getMonth() + 1).padStart(2, "0"),
      year: initialDate.getFullYear().toString(),
    };
  });

  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);

  const handleDateBlur = (part) => {
    const value = dateParts[part];
    if (value && value.length === 1) {
      setDateParts((prev) => ({ ...prev, [part]: value.padStart(2, "0") }));
    }
  };
  const initialFormState = {
    id: null,
    nombre: "",
    descripcion: "",
    monto: "",
    fecha: (() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    })(),
    es_recurrente: false,
  };

  const [form, setForm] = useState(() => {
    if (egresoToEdit) {
      // Mapear los nombres de la BD a los nombres del formulario
      return {
        id: egresoToEdit.id,
        nombre: egresoToEdit.nombre_egreso,
        descripcion: egresoToEdit.desc_egreso || "",
        monto: String(egresoToEdit.monto_egreso),
        fecha: egresoToEdit.fecha_egreso,
        es_recurrente: egresoToEdit.es_recurrente || false,
      };
    }
    return initialFormState;
  });
  const [formErrors, setFormErrors] = useState({ nombre: "" });

  const handleDatePartChange = (part, value) => {
    const numericValue = value.replace(/[^\d]/g, "");
    let newParts = { ...dateParts, [part]: numericValue };

    if (part === "day") {
      if (parseInt(numericValue, 10) > 31) newParts.day = "31";
      if (numericValue.length === 2) monthInputRef.current?.focus();
    }
    if (part === "month") {
      if (parseInt(numericValue, 10) > 12) newParts.month = "12";
      if (numericValue.length === 2) yearInputRef.current?.focus();
    }
    if (part === "year" && numericValue.length === 4) {
      Keyboard.dismiss();
    }

    setDateParts(newParts);
  };

  useEffect(() => {
    const { day, month, year } = dateParts;
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      // Construir fecha en formato local sin conversión UTC
      const newDateString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      // Validar que la fecha sea válida
      const testDate = new Date(year, parseInt(month) - 1, parseInt(day));
      const isValidDate =
        testDate.getFullYear() === parseInt(year) &&
        testDate.getMonth() === parseInt(month) - 1 &&
        testDate.getDate() === parseInt(day);

      if (isValidDate && newDateString !== form.fecha) {
        setForm((prev) => ({ ...prev, fecha: newDateString }));
      }
    }
  }, [dateParts]);

  // --- Lógica para el slider de Monto ---
  const [liveMonto, setLiveMonto] = useState(
    Number(egresoToEdit?.monto_egreso) || 0
  );
  const [maxSliderValue, setMaxSliderValue] = useState(
    Math.max(3000, Number(egresoToEdit?.monto_egreso) || 0)
  );

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleMontoChange = (value) => {
    setLiveMonto(value);
    handleInputChange("monto", String(value));
    if (value > maxSliderValue) {
      setMaxSliderValue(value);
    } else if (value === 0 && maxSliderValue !== 3000) {
      setMaxSliderValue(3000);
    }
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      setFormErrors({ nombre: "El nombre es requerido" });
      return;
    }

    try {
      const egresoPayload = {
        nombre_egreso: form.nombre,
        desc_egreso: form.descripcion || null,
        monto_egreso: Number(form.monto),
        fecha_egreso: form.fecha,
        es_recurrente: form.es_recurrente,
        estado: "pagado", // El primer registro siempre es pagado
      };

      if (form.id) {
        // Actualizar egreso existente
        const { error } = await supabase
          .from("egresos")
          .update(egresoPayload)
          .eq("id", form.id);

        if (error) throw error;
        Alert.alert("Éxito", "Egreso actualizado correctamente");
      } else {
        // Crear nuevo egreso
        const { data: nuevoEgreso, error } = await supabase
          .from("egresos")
          .insert([egresoPayload])
          .select()
          .single();

        if (error) throw error;

        // Si es recurrente, crear el siguiente mes como pendiente
        if (form.es_recurrente) {
          // Parsear la fecha desde el formato YYYY-MM-DD
          const [year, month, day] = form.fecha.split("-").map(Number);
          const siguienteFecha = new Date(year, month - 1, day);
          siguienteFecha.setMonth(siguienteFecha.getMonth() + 1);

          // Formatear la fecha en formato local
          const nextYear = siguienteFecha.getFullYear();
          const nextMonth = String(siguienteFecha.getMonth() + 1).padStart(
            2,
            "0"
          );
          const nextDay = String(siguienteFecha.getDate()).padStart(2, "0");
          const nextDateString = `${nextYear}-${nextMonth}-${nextDay}`;

          const egresoSiguiente = {
            nombre_egreso: form.nombre,
            desc_egreso: form.descripcion || null,
            monto_egreso: Number(form.monto),
            fecha_egreso: nextDateString,
            es_recurrente: true,
            estado: "pendiente",
          };

          const { error: errorSiguiente } = await supabase
            .from("egresos")
            .insert([egresoSiguiente]);

          if (errorSiguiente) {
            console.error("Error creando egreso siguiente:", errorSiguiente);
            // No lanzamos error aquí para no bloquear el guardado principal
          }
        }

        Alert.alert("Éxito", "Egreso registrado correctamente");
      }

      // Llamar a onFormClose para cerrar el formulario y recargar datos
      onFormClose(form, true);
    } catch (error) {
      console.error("Error guardando egreso:", error);
      Alert.alert(
        "Error",
        `Hubo un problema al guardar el egreso: ${error.message}`
      );
    }
  };

  const handleCancel = () => {
    const originalData = egresoToEdit
      ? { ...egresoToEdit, monto: String(egresoToEdit.monto) }
      : initialFormState;
    if (!equal(form, originalData)) {
      Alert.alert(
        "Cambios sin guardar",
        "Tienes cambios sin guardar. ¿Deseas descartarlos?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Descartar",
            style: "destructive",
            onPress: () => onFormClose(null, false),
          },
        ]
      );
    } else {
      onFormClose(null, false);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS !== "web" ? Keyboard.dismiss : ""}
    >
      <KeyboardAvoidingView
        enabled={isLandscape}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={{ flex: 1, backgroundColor: "#f8fafc" }}
        keyboardVerticalOffset={Platform.OS === "android" ? 100 : 0}
      >
        <View className="flex-1 bg-slate-50 p-[16] pb-[28]">
          <View className="max-w-6xl self-start">
            <TouchableOpacity
              onPress={handleCancel}
              className="flex-row items-center mb-4 opacity-80"
            >
              <Svg
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="#475569"
              >
                <Path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
              </Svg>
              <Text className="text-slate-600 font-bold ml-1">
                Volver a la lista
              </Text>
            </TouchableOpacity>
            <Text className="text-slate-900 text-2xl font-extrabold">
              {egresoToEdit ? "Editar Egreso" : "Agregar Egreso"}
            </Text>
            <Text className="text-slate-600">
              Completa los campos para registrar un nuevo egreso.
            </Text>
          </View>

          <ScrollView
            id="form-egreso"
            className="flex-1 max-w-6xl self-center mt-4"
          >
            <View className="flex-row flex-wrap gap-4">
              <View style={[styles_finanzas.half, styles_finanzas.fullOnSmall]}>
                <LabeledInput
                  label="Nombre del Egreso"
                  error={formErrors.nombre}
                >
                  <TextInput
                    value={form.nombre}
                    onChangeText={(text) => handleInputChange("nombre", text)}
                    placeholder="Ej. Pago de servicio de luz"
                    placeholderTextColor="#9ca3af"
                    className={`border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white ${formErrors.nombre ? "border-red-500" : ""}`}
                  />
                </LabeledInput>
              </View>

              <View style={[styles_finanzas.half, styles_finanzas.fullOnSmall]}>
                <View className="flex-row items-center justify-between mb-2 bg-white p-3 rounded-xl border border-slate-200">
                  <Text className="text-slate-700 font-semibold">
                    ¿Es un egreso recurrente?
                  </Text>
                  <Switch
                    trackColor={{ false: "#e2e8f0", true: "#c7d2fe" }}
                    thumbColor={form.es_recurrente ? "#6366f1" : "#f1f5f9"}
                    ios_backgroundColor="#e2e8f0"
                    onValueChange={(value) =>
                      handleInputChange("es_recurrente", value)
                    }
                    value={form.es_recurrente}
                  />
                </View>
                {form.es_recurrente && (
                  <Text
                    className={`text-xs absolute ${isLandscape ? "-bottom-5" : "-bottom-8"} text-indigo-600 mb-2 px-1`}
                  >
                    Se creará automáticamente un egreso pendiente para el
                    próximo mes.
                  </Text>
                )}
              </View>

              <View style={{ width: "100%" }}>
                <LabeledInput label="Descripción (Opcional)">
                  <TextInput
                    value={form.descripcion}
                    onChangeText={(text) =>
                      handleInputChange("descripcion", text)
                    }
                    placeholder="Detalles adicionales sobre el egreso"
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={3}
                    className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white h-24"
                    style={{ textAlignVertical: "top" }}
                  />
                </LabeledInput>
              </View>

              <View style={{ width: "100%" }}>
                <View className="mb-4">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-slate-700 text-xs font-semibold uppercase tracking-wide">
                      Fecha de Registro
                    </Text>
                    <TouchableOpacity
                      onPress={() => setIsDateEditable(!isDateEditable)}
                      className="ml-2 p-1 rounded-full bg-slate-200"
                    >
                      <Svg
                        height="14"
                        viewBox="0 -960 960 960"
                        width="14"
                        fill="#475569"
                      >
                        <Path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 23 56.5T849-602l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  <View
                    className={`flex-row items-center border border-slate-300 rounded-xl p-1 ${isDateEditable ? "bg-white" : "bg-slate-100 opacity-70"}`}
                  >
                    <TextInput
                      style={styles_registro_venta.dateInput}
                      placeholder="DD"
                      value={dateParts.day}
                      editable={isDateEditable}
                      onChangeText={(text) => handleDatePartChange("day", text)}
                      onBlur={() => handleDateBlur("day")}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text style={styles_registro_venta.dateSeparator}>/</Text>
                    <TextInput
                      ref={monthInputRef}
                      style={styles_registro_venta.dateInput}
                      placeholder="MM"
                      value={dateParts.month}
                      editable={isDateEditable}
                      onChangeText={(text) =>
                        handleDatePartChange("month", text)
                      }
                      onBlur={() => handleDateBlur("month")}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text style={styles_registro_venta.dateSeparator}>/</Text>
                    <TextInput
                      ref={yearInputRef}
                      style={[styles_registro_venta.dateInput, { flex: 1.5 }]}
                      placeholder="AAAA"
                      value={dateParts.year}
                      editable={isDateEditable}
                      onChangeText={(text) =>
                        handleDatePartChange("year", text)
                      }
                      keyboardType="number-pad"
                      maxLength={4}
                    />
                  </View>
                </View>
              </View>

              <View style={{ width: "100%" }}>
                <LabeledInput label="Monto">
                  <View className="flex-row items-center">
                    <StepButton
                      type="decrement"
                      disabled={(Number(form.monto) || 0) <= 0}
                      onPress={() =>
                        handleMontoChange(Math.max(0, liveMonto - 50))
                      }
                    />
                    <Slider
                      style={{ flex: 1, height: 40 }}
                      minimumValue={0}
                      maximumValue={maxSliderValue}
                      step={50}
                      value={liveMonto}
                      onSlidingComplete={handleMontoChange}
                      minimumTrackTintColor={"#6F09EA"}
                      maximumTrackTintColor="#d1d5db"
                      thumbTintColor={"#6F09EA"}
                    />
                    <CurrencyInput
                      value={form.monto}
                      onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, "");
                        if (numericText.length > 4) {
                          handleMontoChange(maxSliderValue);
                        } else {
                          handleMontoChange(Number(numericText) || 0);
                        }
                      }}
                    />
                    <StepButton
                      type="increment"
                      onPress={() => handleMontoChange(liveMonto + 50)}
                    />
                  </View>
                  <ChipButtonGroup
                    chips={useMemo(() => {
                      const standardChips = new Set([
                        500, 1000, 1500, 2000, 2500, 3000,
                      ]);
                      if (maxSliderValue > 3000) {
                        for (let i = 3500; i <= maxSliderValue; i += 500) {
                          standardChips.add(i);
                        }
                      }
                      return Array.from(standardChips)
                        .sort((a, b) => a - b)
                        .map((v) => ({ label: `$${v}`, value: v }));
                    }, [maxSliderValue])}
                    selectedValue={Number(form.monto)}
                    onSelect={(value) => {
                      handleMontoChange(value);
                      setMaxSliderValue((currentMax) =>
                        Math.max(currentMax, value, 3000)
                      );
                    }}
                  />
                </LabeledInput>
              </View>
            </View>

            <View className="mt-3 flex-row justify-end gap-2">
              <Pressable
                onPress={handleCancel}
                className="px-4 py-3 rounded-xl border border-slate-300 bg-white"
                android_ripple={{ color: "rgba(0,0,0,0.06)" }}
              >
                <Text className="text-slate-700 font-semibold">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                disabled={!form.nombre.trim() || Number(form.monto) <= 0}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    form.nombre.trim() && Number(form.monto) > 0
                      ? "#6F09EA"
                      : "#cbd5e1",
                }}
                android_ripple={{ color: "rgba(255,255,255,0.15)" }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color:
                      form.nombre.trim() && Number(form.monto) > 0
                        ? "#ffffff"
                        : "#64748b",
                  }}
                >
                  Guardar
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const RegistroIngreso = ({ ingresoToEdit, onFormClose }) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // --- Lógica para los inputs de fecha segmentados ---
  const [isDateEditable, setIsDateEditable] = useState(false);
  const [dateParts, setDateParts] = useState(() => {
    const initialDate = ingresoToEdit?.fecha_ingreso
      ? new Date(ingresoToEdit.fecha_ingreso + "T00:00:00") // Asegurar que se interprete como local
      : new Date();
    return {
      day: String(initialDate.getDate()).padStart(2, "0"),
      month: String(initialDate.getMonth() + 1).padStart(2, "0"),
      year: initialDate.getFullYear().toString(),
    };
  });

  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);

  const handleDateBlur = (part) => {
    const value = dateParts[part];
    if (value && value.length === 1) {
      setDateParts((prev) => ({ ...prev, [part]: value.padStart(2, "0") }));
    }
  };

  const initialFormState = {
    id: null,
    nombre: "",
    descripcion: "",
    monto: "",
    fecha: (() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    })(),
    es_recurrente: false,
  };

  const [form, setForm] = useState(() => {
    if (ingresoToEdit) {
      // Mapear los nombres de la BD a los nombres del formulario
      return {
        id: ingresoToEdit.id_ingreso,
        nombre: ingresoToEdit.nombre_ingreso,
        descripcion: ingresoToEdit.desc_ingreso || "",
        monto: String(ingresoToEdit.monto_ingreso),
        fecha: ingresoToEdit.fecha_ingreso,
      };
    }
    return initialFormState;
  });
  const [formErrors, setFormErrors] = useState({ nombre: "" });

  const handleDatePartChange = (part, value) => {
    const numericValue = value.replace(/[^\d]/g, "");
    let newParts = { ...dateParts, [part]: numericValue };

    if (part === "day") {
      if (parseInt(numericValue, 10) > 31) newParts.day = "31";
      if (numericValue.length === 2) monthInputRef.current?.focus();
    }
    if (part === "month") {
      if (parseInt(numericValue, 10) > 12) newParts.month = "12";
      if (numericValue.length === 2) yearInputRef.current?.focus();
    }
    if (part === "year" && numericValue.length === 4) {
      Keyboard.dismiss();
    }

    setDateParts(newParts);
  };

  useEffect(() => {
    const { day, month, year } = dateParts;
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      // Construir fecha en formato local sin conversión UTC
      const newDateString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      // Validar que la fecha sea válida
      const testDate = new Date(year, parseInt(month) - 1, parseInt(day));
      const isValidDate =
        testDate.getFullYear() === parseInt(year) &&
        testDate.getMonth() === parseInt(month) - 1 &&
        testDate.getDate() === parseInt(day);

      if (isValidDate && newDateString !== form.fecha) {
        setForm((prev) => ({ ...prev, fecha: newDateString }));
      }
    }
  }, [dateParts]);

  // --- Lógica para el slider de Monto ---
  const [liveMonto, setLiveMonto] = useState(
    Number(ingresoToEdit?.monto_ingreso) || 0
  );
  const [maxSliderValue, setMaxSliderValue] = useState(
    Math.max(3000, Number(ingresoToEdit?.monto_ingreso) || 0)
  );

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleMontoChange = (value) => {
    setLiveMonto(value);
    handleInputChange("monto", String(value));
    if (value > maxSliderValue) {
      setMaxSliderValue(value);
    } else if (value === 0 && maxSliderValue !== 3000) {
      setMaxSliderValue(3000);
    }
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      setFormErrors({ nombre: "El nombre es requerido" });
      return;
    }

    try {
      const ingresoPayload = {
        nombre_ingreso: form.nombre,
        desc_ingreso: form.descripcion || null,
        monto_ingreso: Number(form.monto),
        fecha_ingreso: form.fecha,
      };

      if (form.id) {
        // Actualizar ingreso existente
        const { error } = await supabase
          .from("ingresos")
          .update(ingresoPayload)
          .eq("id_ingreso", form.id);

        if (error) throw error;
        Alert.alert("Éxito", "Ingreso actualizado correctamente");
      } else {
        // Crear nuevo ingreso
        const { data: nuevoIngreso, error } = await supabase
          .from("ingresos")
          .insert([ingresoPayload])
          .select()
          .single();

        if (error) throw error;

        // Si es recurrente, crear el siguiente mes como pendiente

        Alert.alert("Éxito", "Ingreso registrado correctamente");
      }
      onFormClose(form, true);
    } catch (error) {
      console.error("Error saving income:", error);
      Alert.alert("Error", "No se pudo guardar el ingreso");
    }
  };

  const handleCancel = () => {
    onFormClose(null, false);
  };

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS !== "web" ? Keyboard.dismiss : ""}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={{ flex: 1, backgroundColor: "#f8fafc" }}
        keyboardVerticalOffset={Platform.OS === "android" ? 100 : 0}
      >
        <View className="flex-1 bg-slate-50 p-[16] pb-[28]">
          <View className="max-w-6xl self-start">
            <TouchableOpacity
              onPress={handleCancel}
              className="flex-row items-center mb-4 opacity-80"
            >
              <Svg
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="#475569"
              >
                <Path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
              </Svg>
              <Text className="text-slate-600 font-bold ml-1">
                Volver a la lista
              </Text>
            </TouchableOpacity>
            <Text className="text-slate-900 text-2xl font-extrabold">
              {ingresoToEdit ? "Editar Ingreso" : "Agregar Ingreso"}
            </Text>
            <Text className="text-slate-600">
              {ingresoToEdit
                ? "Modifica los datos del ingreso."
                : "Completa los siguientes campos para registrar un nuevo ingreso."}
            </Text>
          </View>

          <ScrollView className="flex-1 max-w-6xl self-center mt-4">
            <View className="flex-row flex-wrap gap-4">
              <View style={{ width: "100%" }}>
                <LabeledInput
                  label="Nombre del Ingreso"
                  error={formErrors.nombre}
                >
                  <TextInput
                    value={form.nombre}
                    onChangeText={(text) => handleInputChange("nombre", text)}
                    placeholder="Ej. Venta de producto"
                    placeholderTextColor="#9ca3af"
                    className={`border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white ${formErrors.nombre ? "border-red-500" : ""}`}
                  />
                </LabeledInput>
              </View>

              <View style={{ width: "100%" }}>
                <LabeledInput label="Descripción (Opcional)">
                  <TextInput
                    value={form.descripcion}
                    onChangeText={(text) =>
                      handleInputChange("descripcion", text)
                    }
                    placeholder="Detalles adicionales..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={3}
                    className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white h-24"
                    style={{ textAlignVertical: "top" }}
                  />
                </LabeledInput>
              </View>

              <View style={{ width: "100%" }}>
                <View className="mb-4">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-slate-700 text-xs font-semibold uppercase tracking-wide">
                      Fecha de Registro
                    </Text>
                    <TouchableOpacity
                      onPress={() => setIsDateEditable(!isDateEditable)}
                      className="ml-2 p-1 rounded-full bg-slate-200"
                    >
                      <Svg
                        height="14"
                        viewBox="0 -960 960 960"
                        width="14"
                        fill="#475569"
                      >
                        <Path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 23 56.5T849-602l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  <View
                    className={`flex-row items-center border border-slate-300 rounded-xl p-1 ${isDateEditable ? "bg-white" : "bg-slate-100 opacity-70"}`}
                  >
                    <TextInput
                      style={styles_registro_venta.dateInput}
                      placeholder="DD"
                      value={dateParts.day}
                      editable={isDateEditable}
                      onChangeText={(text) => handleDatePartChange("day", text)}
                      onBlur={() => handleDateBlur("day")}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text style={styles_registro_venta.dateSeparator}>/</Text>
                    <TextInput
                      ref={monthInputRef}
                      style={styles_registro_venta.dateInput}
                      placeholder="MM"
                      value={dateParts.month}
                      editable={isDateEditable}
                      onChangeText={(text) =>
                        handleDatePartChange("month", text)
                      }
                      onBlur={() => handleDateBlur("month")}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text style={styles_registro_venta.dateSeparator}>/</Text>
                    <TextInput
                      ref={yearInputRef}
                      style={[styles_registro_venta.dateInput, { flex: 1.5 }]}
                      placeholder="AAAA"
                      value={dateParts.year}
                      editable={isDateEditable}
                      onChangeText={(text) =>
                        handleDatePartChange("year", text)
                      }
                      keyboardType="number-pad"
                      maxLength={4}
                    />
                  </View>
                </View>
              </View>

              <View style={{ width: "100%" }}>
                <LabeledInput label="Monto">
                  <View className="flex-row items-center">
                    <StepButton
                      type="decrement"
                      disabled={(Number(form.monto) || 0) <= 0}
                      onPress={() =>
                        handleMontoChange(Math.max(0, liveMonto - 50))
                      }
                    />
                    <Slider
                      style={{ flex: 1, height: 40 }}
                      minimumValue={0}
                      maximumValue={maxSliderValue}
                      step={50}
                      value={liveMonto}
                      onSlidingComplete={handleMontoChange}
                      minimumTrackTintColor={"#6F09EA"}
                      maximumTrackTintColor="#d1d5db"
                      thumbTintColor={"#6F09EA"}
                    />
                    <CurrencyInput
                      value={form.monto}
                      onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, "");
                        if (numericText.length > 4) {
                          handleMontoChange(maxSliderValue);
                        } else {
                          handleMontoChange(Number(numericText) || 0);
                        }
                      }}
                    />
                    <StepButton
                      type="increment"
                      onPress={() => handleMontoChange(liveMonto + 50)}
                    />
                  </View>
                  <ChipButtonGroup
                    chips={useMemo(() => {
                      const standardChips = new Set([
                        500, 1000, 1500, 2000, 2500, 3000,
                      ]);
                      if (maxSliderValue > 3000) {
                        for (let i = 3500; i <= maxSliderValue; i += 500) {
                          standardChips.add(i);
                        }
                      }
                      return Array.from(standardChips)
                        .sort((a, b) => a - b)
                        .map((v) => ({ label: `$${v}`, value: v }));
                    }, [maxSliderValue])}
                    selectedValue={Number(form.monto)}
                    onSelect={(value) => {
                      handleMontoChange(value);
                      setMaxSliderValue((currentMax) =>
                        Math.max(currentMax, value, 3000)
                      );
                    }}
                  />
                </LabeledInput>
              </View>
            </View>

            <View className="mt-3 flex-row justify-end gap-2">
              <Pressable
                onPress={handleCancel}
                className="px-4 py-3 rounded-xl border border-slate-300 bg-white"
                android_ripple={{ color: "rgba(0,0,0,0.06)" }}
              >
                <Text className="text-slate-700 font-semibold">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                disabled={!form.nombre.trim() || Number(form.monto) <= 0}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    form.nombre.trim() && Number(form.monto) > 0
                      ? "#6F09EA"
                      : "#cbd5e1",
                }}
                android_ripple={{ color: "rgba(255,255,255,0.15)" }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color:
                      form.nombre.trim() && Number(form.monto) > 0
                        ? "#ffffff"
                        : "#64748b",
                  }}
                >
                  Guardar
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const TablaEgresos = ({ onEdit, refreshTrigger, dateFilter }) => {
  const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPending, setShowPending] = useState(false); // Estado para mostrar/ocultar pendientes
  const [sortKey, setSortKey] = useState(null); // Default to null to respect fetch order
  const [sortDir, setSortDir] = useState("desc");

  // Filtrar y agrupar datos
  const filteredAndGroupedData = useMemo(() => {
    // 1. Filtrar pendientes si es necesario
    let filtered = data;
    if (!showPending) {
      filtered = data.filter((item) => item.estado !== "pendiente");
    }

    // 2. Filtrar por fecha según dateFilter
    if (dateFilter) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      filtered = filtered.filter((item) => {
        if (!item.fecha_egreso) return false;
        const [year, month, day] = item.fecha_egreso.split("-").map(Number);
        const itemDate = new Date(year, month - 1, day);

        if (dateFilter === "last_month") {
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          return itemDate >= oneMonthAgo;
        } else if (dateFilter === "3_months_ago") {
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          return itemDate >= threeMonthsAgo;
        } else if (dateFilter.startsWith("year-")) {
          const filterYear = parseInt(dateFilter.split("-")[1]);
          return itemDate.getFullYear() === filterYear;
        }
        return true;
      });
    }

    // 3. Ordenar si hay sortKey
    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        // Always put 'pendiente' at the bottom
        if (a.estado !== b.estado) {
          if (a.estado === "pendiente") return 1;
          if (b.estado === "pendiente") return -1;
        }

        let va = a[sortKey] ?? "";
        let vb = b[sortKey] ?? "";
        if (typeof va === "string") va = va.toLowerCase();
        if (typeof vb === "string") vb = vb.toLowerCase();

        if (va < vb) return sortDir === "asc" ? -1 : 1;
        if (va > vb) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    // 4. Determinar si agrupar por año o mes
    // Agrupar por MES en todos los casos
    const shouldGroupByMonth =
      dateFilter === "last_month" ||
      dateFilter === "3_months_ago" ||
      dateFilter?.startsWith("year-");

    if (shouldGroupByMonth) {
      // Separar pendientes y pagados
      const pendientes = filtered.filter((item) => item.estado === "pendiente");
      const pagados = filtered.filter((item) => item.estado === "pagado");

      // Determinar si necesitamos agregar el año a los pendientes
      const needYearInPending = () => {
        if (pendientes.length === 0) return false;

        const currentYear = new Date().getFullYear();

        // Obtener el año de los pendientes
        const pendienteYear = parseInt(
          pendientes[0].fecha_egreso.split("-")[0]
        );

        // Solo agregar año si los pendientes son de un año diferente al actual
        return pendienteYear !== currentYear;
      };

      const addYearToPending = needYearInPending();

      // Agrupar pendientes por mes
      const pendientesGroups = {};
      pendientes.forEach((item) => {
        if (!item.fecha_egreso) return;
        const [year, month] = item.fecha_egreso.split("-");
        const monthNum = parseInt(month) - 1;
        const monthName = new Date(year, monthNum).toLocaleDateString("es-MX", {
          month: "long",
        });
        const displayName = addYearToPending
          ? `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`
          : monthName.charAt(0).toUpperCase() + monthName.slice(1);
        const key = `${monthNum}-${displayName}-pendiente`;
        if (!pendientesGroups[key]) pendientesGroups[key] = [];
        pendientesGroups[key].push(item);
      });

      // Agrupar pagados por mes
      const pagadosGroups = {};
      pagados.forEach((item) => {
        if (!item.fecha_egreso) return;
        const [year, month] = item.fecha_egreso.split("-");
        const monthNum = parseInt(month) - 1;
        const monthName = new Date(year, monthNum).toLocaleDateString("es-MX", {
          month: "long",
        });
        const key = `${monthNum}-${monthName}`;
        if (!pagadosGroups[key]) pagadosGroups[key] = [];
        pagadosGroups[key].push(item);
      });

      // Ordenar grupos
      const sortedPendientes = Object.keys(pendientesGroups).sort((a, b) => {
        const numA = parseInt(a.split("-")[0]);
        const numB = parseInt(b.split("-")[0]);
        return numA - numB; // Ascendente para pendientes (próximos primero)
      });

      const sortedPagados = Object.keys(pagadosGroups).sort((a, b) => {
        const numA = parseInt(a.split("-")[0]);
        const numB = parseInt(b.split("-")[0]);
        return numB - numA; // Descendente para pagados (más recientes primero)
      });

      // Combinar: pendientes arriba, pagados abajo
      const allGroups = { ...pendientesGroups, ...pagadosGroups };
      const allKeys = [...sortedPendientes, ...sortedPagados];

      return { grouped: true, type: "month", keys: allKeys, data: allGroups };
    } else {
      // Agrupar por año
      const groups = {};
      filtered.forEach((item) => {
        if (!item.fecha_egreso) return;
        const year = item.fecha_egreso.split("-")[0];
        if (!groups[year]) groups[year] = [];
        groups[year].push(item);
      });

      const sortedYears = Object.keys(groups).sort((a, b) => b - a);
      return { grouped: true, type: "year", keys: sortedYears, data: groups };
    }
  }, [data, sortKey, sortDir, showPending, dateFilter]);

  const headers = [
    { title: "Nombre", flex: 4, key: "nombre_egreso" },
    { title: "Descripción", flex: 5, key: "desc_egreso" },
    { title: "Fecha", flex: 2.3, center: true, key: "fecha_egreso" },
    { title: "Monto", flex: 2.5, center: true, key: "monto_egreso" }, // Increased flex slightly
    { title: "", flex: 1, center: true, key: "actions" },
  ];

  const handleFetch = async () => {
    try {
      setLoading(true);
      const { data: egresos, error } = await supabase
        .from("egresos")
        .select("*")
        .order("estado", { ascending: true }) // 'pagado' comes before 'pendiente'
        .order("fecha_egreso", { ascending: false });

      if (error) throw error;

      // Procesar egresos recurrentes automáticamente
      await processRecurringEgresos(egresos || []);

      // Volver a cargar después de procesar
      const { data: updatedEgresos } = await supabase
        .from("egresos")
        .select("*")
        .order("estado", { ascending: true }) // 'pagado' comes before 'pendiente'
        .order("fecha_egreso", { ascending: false });

      setData(updatedEgresos || []);
    } catch (error) {
      console.error("Error fetching egresos:", error);
      Alert.alert("Error", "No se pudieron cargar los egresos");
    } finally {
      setLoading(false);
    }
  };

  // Función para procesar egresos recurrentes automáticamente
  const processRecurringEgresos = async (egresos) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const egreso of egresos) {
      // Solo procesar egresos recurrentes pendientes
      if (egreso.es_recurrente && egreso.estado === "pendiente") {
        // Parsear la fecha desde el formato YYYY-MM-DD
        const [year, month, day] = egreso.fecha_egreso.split("-").map(Number);
        const egresoDate = new Date(year, month - 1, day);
        egresoDate.setHours(0, 0, 0, 0);

        // Si la fecha del egreso ya pasó o es hoy
        if (egresoDate <= today) {
          try {
            // 1. Marcar el egreso actual como pagado
            const { error: updateError } = await supabase
              .from("egresos")
              .update({ estado: "pagado" })
              .eq("id", egreso.id);

            if (updateError) {
              console.error("Error updating egreso:", updateError);
              continue;
            }

            // 2. Crear el siguiente egreso pendiente para el próximo mes
            const nextMonthDate = new Date(egresoDate);
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

            // Formatear la fecha en formato local
            const nextYear = nextMonthDate.getFullYear();
            const nextMonth = String(nextMonthDate.getMonth() + 1).padStart(
              2,
              "0"
            );
            const nextDay = String(nextMonthDate.getDate()).padStart(2, "0");
            const nextDateString = `${nextYear}-${nextMonth}-${nextDay}`;

            const newEgreso = {
              nombre_egreso: egreso.nombre_egreso,
              desc_egreso: egreso.desc_egreso,
              monto_egreso: egreso.monto_egreso,
              fecha_egreso: nextDateString,
              es_recurrente: true,
              estado: "pendiente",
            };

            const { error: insertError } = await supabase
              .from("egresos")
              .insert([newEgreso]);

            if (insertError) {
              console.error("Error creating next egreso:", insertError);
            } else {
              console.log(
                `✅ Egreso recurrente procesado: ${egreso.nombre_egreso} - Siguiente fecha: ${newEgreso.fecha_egreso}`
              );
            }
          } catch (err) {
            console.error("Error processing recurring egreso:", err);
          }
        }
      }
    }
  };

  // Función para refrescar con pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await handleFetch();
    setRefreshing(false);
  };

  // Recargar datos cuando refreshTrigger cambia
  useEffect(() => {
    handleFetch();
  }, [refreshTrigger]);

  // Recargar datos cuando se entra a la sección
  useFocusEffect(
    useCallback(() => {
      handleFetch();
    }, [])
  );

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366f1"]}
            tintColor="#6366f1"
          />
        }
      >
        <View className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          {/* Toolbar con Checkbox para Pendientes */}
          <View className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex-row justify-end items-center">
            <TouchableOpacity
              onPress={() => setShowPending(!showPending)}
              className="flex-row items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
              activeOpacity={0.7}
            >
              <View
                className={`w-5 h-5 rounded border ${showPending ? "bg-indigo-600 border-indigo-600" : "border-slate-300 bg-white"} items-center justify-center`}
              >
                {showPending && (
                  <Svg
                    height="14"
                    viewBox="0 -960 960 960"
                    width="14"
                    fill="white"
                  >
                    <Path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                  </Svg>
                )}
              </View>
              <Text className="text-slate-600 text-sm font-medium">
                Mostrar pendientes
              </Text>
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View className="bg-slate-100 border-b border-slate-200 flex-row">
            {headers.map((header, index) => (
              <TouchableOpacity
                key={header.key || header.title || index}
                style={{
                  flex: header.flex,
                  alignItems: header.center ? "center" : "flex-start",
                }}
                className="py-3 px-3 flex-row gap-1"
                onPress={() => {
                  if (!header.key) return;
                  if (sortKey === header.key) {
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  } else {
                    setSortKey(header.key);
                    setSortDir("asc");
                  }
                }}
                disabled={!header.key}
              >
                <Text className="text-slate-800 font-semibold text-xs uppercase tracking-wide">
                  {header.title}
                </Text>
                {sortKey === header.key && (
                  <Text className="text-slate-600 text-xs">
                    {sortDir === "asc" ? "↑" : "↓"}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Body */}
          {loading ? (
            <View className="p-8 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#6366f1" />
              <Text className="text-slate-500 text-center font-medium mt-4">
                Cargando egresos...
              </Text>
            </View>
          ) : filteredAndGroupedData.keys &&
            filteredAndGroupedData.keys.length > 0 ? (
            filteredAndGroupedData.keys.map((key) => {
              const displayLabel =
                filteredAndGroupedData.type === "month"
                  ? key.split("-")[1].charAt(0).toUpperCase() +
                    key.split("-")[1].slice(1)
                  : key;
              const icon =
                filteredAndGroupedData.type === "month"
                  ? "M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Zm0 200q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Z"
                  : "M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z";

              return (
                <View key={key}>
                  {/* Header del año o mes */}
                  <View className="bg-red-600 py-3 px-4 flex-row items-center border-t border-red-700">
                    <Svg
                      height="20"
                      viewBox="0 -960 960 960"
                      width="20"
                      fill="#ffffff"
                    >
                      <Path d={icon} />
                    </Svg>
                    <Text className="text-white font-bold text-lg ml-2">
                      {displayLabel}
                    </Text>
                    <View className="flex-1" />
                    <View className="bg-white/20 px-3 py-1 rounded-full">
                      <Text className="text-white text-sm font-semibold">
                        {filteredAndGroupedData.data[key].length}{" "}
                        {filteredAndGroupedData.data[key].length === 1
                          ? "egreso"
                          : "egresos"}
                      </Text>
                    </View>
                  </View>
                  {/* Egresos del grupo */}
                  {filteredAndGroupedData.data[key].map((egreso, index) => (
                    <View
                      key={egreso.id}
                      className={`flex-row items-center border-t border-slate-200 ${
                        index % 2 ? "bg-white" : "bg-slate-50"
                      } ${egreso.estado === "pendiente" ? "opacity-50" : ""}`}
                    >
                      <Text
                        style={{ flex: 4 }}
                        className="p-3 text-slate-800"
                        numberOfLines={1}
                      >
                        {egreso.nombre_egreso || egreso.nombre || "Sin nombre"}
                      </Text>
                      <Text
                        style={{ flex: 5 }}
                        className="p-3 text-slate-700"
                        numberOfLines={1}
                      >
                        {egreso.desc_egreso || egreso.descripcion || "-"}
                      </Text>
                      <Text
                        style={{ flex: 2.3 }}
                        className="p-3 text-slate-600"
                      >
                        {(() => {
                          const [year, month, day] =
                            egreso.fecha_egreso.split("-");
                          const date = new Date(year, parseInt(month) - 1, day);
                          const monthName = date.toLocaleDateString("es-MX", {
                            month: "short",
                          });
                          return `${day} ${monthName}`;
                        })()}
                      </Text>

                      {/* Columna de Monto con Icono de Estado */}
                      <View
                        style={{
                          flex: 2.5,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                        className="p-3"
                      >
                        <Text className="text-slate-800 font-medium">
                          {currencyFormatter.format(
                            egreso.monto_egreso || egreso.monto || 0
                          )}
                        </Text>
                        {egreso.estado === "pagado" ? (
                          <Svg
                            height="16"
                            viewBox="0 -960 960 960"
                            width="16"
                            fill="#22c55e"
                          >
                            <Path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                          </Svg>
                        ) : (
                          <Svg
                            height="16"
                            viewBox="0 -960 960 960"
                            width="16"
                            fill="#f59e0b"
                          >
                            <Path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm-40-200h120v-80H480v-160h-80v200h40Z" />
                          </Svg>
                        )}
                      </View>

                      <View
                        style={{ flex: 1 }}
                        className="p-3 flex-row justify-center items-center"
                      >
                        <TouchableOpacity onPress={() => onEdit(egreso)}>
                          <Svg
                            height="22"
                            viewBox="0 -960 960 960"
                            width="22"
                            fill="#3b82f6"
                          >
                            <Path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 23 56.5T849-602l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
                          </Svg>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })
          ) : (
            <View className="p-8 items-center justify-center bg-white">
              <Text className="text-slate-500 text-center font-medium">
                No hay egresos para mostrar en este período.
              </Text>
              <Text className="text-slate-400 text-center text-sm mt-1">
                Intenta con otro mes/año o agrega un nuevo egreso.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const CustomFinanzasTabBar = (props) => {
  const { state, descriptors, navigation, position } = props;
  const {
    syncDateFilters,
    setSyncDateFilters,
    selectedIngresoDateFilter,
    setSelectedEgresoDateFilter,
  } = props.screenProps;

  return (
    <View className="flex-row items-center justify-between bg-slate-50 border-b border-slate-200 pr-4">
      {/* Contenedor de las pestañas */}
      <View className="flex-row">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              className={`py-3 px-4 border-b-2 ${isFocused ? "border-slate-900" : "border-transparent"}`}
            >
              <Text
                className={`uppercase font-bold ${isFocused ? "text-slate-900" : "text-slate-500"}`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Helper function para formatear fechas sin usar .map()
const formatDateMX = (dateString) => {
  if (!dateString) return "-";
  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-MX");
};

// Headers de la tabla de ingresos
const ingresosHeaders = [
  { title: "Nombre", flex: 4, key: "nombre_ingreso" },
  { title: "Descripción", flex: 5, key: "desc_ingreso" },
  { title: "Fecha", flex: 2.3, center: true, key: "fecha_ingreso" },
  { title: "Monto", flex: 2.5, center: true, key: "monto_ingreso" },
  { title: "", flex: 1, center: true, key: "actions" },
];

const TablaIngresos = ({ onEdit, refreshTrigger, dateFilter }) => {
  const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("desc");

  const handleFetch = async () => {
    try {
      setLoading(true);
      const { data: ingresos, error } = await supabase
        .from("ingresos")
        .select("*")
        .order("fecha_ingreso", { ascending: false });

      if (error) throw error;
      setData(ingresos || []);
    } catch (error) {
      console.error("Error fetching ingresos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [refreshTrigger]);

  useFocusEffect(
    useCallback(() => {
      handleFetch();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await handleFetch();
    setRefreshing(false);
  };

  // Filtrar y agrupar datos
  const filteredAndGroupedData = useMemo(() => {
    // 1. Filtrar por fecha según dateFilter
    let filtered = data;

    if (dateFilter) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      filtered = data.filter((item) => {
        if (!item.fecha_ingreso) return false;
        const [year, month, day] = item.fecha_ingreso.split("-").map(Number);
        const itemDate = new Date(year, month - 1, day);

        if (dateFilter === "last_month") {
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          return itemDate >= oneMonthAgo;
        } else if (dateFilter === "3_months_ago") {
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          return itemDate >= threeMonthsAgo;
        } else if (dateFilter.startsWith("year-")) {
          const filterYear = parseInt(dateFilter.split("-")[1]);
          return itemDate.getFullYear() === filterYear;
        }
        return true;
      });
    }

    // 2. Ordenar si hay sortKey
    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        let va = a[sortKey] ?? "";
        let vb = b[sortKey] ?? "";
        if (typeof va === "string") va = va.toLowerCase();
        if (typeof vb === "string") vb = vb.toLowerCase();
        if (va < vb) return sortDir === "asc" ? -1 : 1;
        if (va > vb) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    // 3. Determinar si agrupar por año o mes
    // Agrupar por MES en todos los casos
    const shouldGroupByMonth =
      dateFilter === "last_month" ||
      dateFilter === "3_months_ago" ||
      dateFilter?.startsWith("year-");

    if (shouldGroupByMonth) {
      // Agrupar por mes
      const groups = {};
      filtered.forEach((item) => {
        if (!item.fecha_ingreso) return;
        const [year, month] = item.fecha_ingreso.split("-");
        const monthNum = parseInt(month) - 1;
        const monthName = new Date(year, monthNum).toLocaleDateString("es-MX", {
          month: "long",
        });
        const key = `${monthNum}-${monthName}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
      });

      const sortedMonths = Object.keys(groups).sort((a, b) => {
        const numA = parseInt(a.split("-")[0]);
        const numB = parseInt(b.split("-")[0]);
        return numB - numA;
      });

      return { grouped: true, type: "month", keys: sortedMonths, data: groups };
    } else {
      // Agrupar por año
      const groups = {};
      filtered.forEach((item) => {
        if (!item.fecha_ingreso) return;
        const year = item.fecha_ingreso.split("-")[0];
        if (!groups[year]) groups[year] = [];
        groups[year].push(item);
      });

      const sortedYears = Object.keys(groups).sort((a, b) => b - a);
      return { grouped: true, type: "year", keys: sortedYears, data: groups };
    }
  }, [data, sortKey, sortDir, dateFilter]);

  const refreshColors = ["#6366f1"];

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={refreshColors}
            tintColor="#6366f1"
          />
        }
      >
        <View className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <View className="bg-slate-100 border-b border-slate-200 flex-row">
            {ingresosHeaders.map((header, index) => (
              <TouchableOpacity
                key={header.key || header.title || index}
                style={{
                  flex: header.flex,
                  alignItems: header.center ? "center" : "flex-start",
                }}
                className="py-3 px-3 flex-row"
                onPress={() => {
                  if (!header.key) return;
                  if (sortKey === header.key) {
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  } else {
                    setSortKey(header.key);
                    setSortDir("asc");
                  }
                }}
                disabled={!header.key}
              >
                <Text className="text-slate-800 font-semibold text-xs uppercase tracking-wide">
                  {header.title}
                </Text>
                {sortKey === header.key && (
                  <Text className="text-slate-600 text-xs ml-1">
                    {sortDir === "asc" ? "↑" : "↓"}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Body */}
          {loading ? (
            <View className="p-8 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#6366f1" />
              <Text className="text-slate-500 text-center font-medium mt-4">
                Cargando ingresos...
              </Text>
            </View>
          ) : filteredAndGroupedData.keys &&
            filteredAndGroupedData.keys.length > 0 ? (
            filteredAndGroupedData.keys.map((key) => {
              const displayLabel =
                filteredAndGroupedData.type === "month"
                  ? key.split("-")[1].charAt(0).toUpperCase() +
                    key.split("-")[1].slice(1)
                  : key;
              const icon =
                filteredAndGroupedData.type === "month"
                  ? "M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Zm0 200q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Z"
                  : "M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z";

              return (
                <View key={key}>
                  {/* Header del año o mes */}
                  <View className="bg-indigo-600 py-3 px-4 flex-row items-center border-t border-indigo-700">
                    <Svg
                      height="20"
                      viewBox="0 -960 960 960"
                      width="20"
                      fill="#ffffff"
                    >
                      <Path d={icon} />
                    </Svg>
                    <Text className="text-white font-bold text-lg ml-2">
                      {displayLabel}
                    </Text>
                    <View className="flex-1" />
                    <View className="bg-white/20 px-3 py-1 rounded-full">
                      <Text className="text-white text-sm font-semibold">
                        {filteredAndGroupedData.data[key].length}{" "}
                        {filteredAndGroupedData.data[key].length === 1
                          ? "ingreso"
                          : "ingresos"}
                      </Text>
                    </View>
                  </View>
                  {/* Ingresos del grupo */}
                  {filteredAndGroupedData.data[key].map((ingreso, index) => (
                    <View
                      key={ingreso.id_ingreso || index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderTopWidth: 1,
                        borderTopColor: "#e2e8f0",
                        backgroundColor: index % 2 ? "#ffffff" : "#f8fafc",
                      }}
                    >
                      <Text
                        style={{ flex: 4 }}
                        className="p-3 text-slate-800"
                        numberOfLines={1}
                      >
                        {ingreso.nombre_ingreso}
                      </Text>
                      <Text
                        style={{ flex: 5 }}
                        className="p-3 text-slate-700"
                        numberOfLines={1}
                      >
                        {ingreso.desc_ingreso || "-"}
                      </Text>
                      <Text
                        style={{ flex: 2.3 }}
                        className="p-3 text-slate-600"
                      >
                        {(() => {
                          const [year, month, day] =
                            ingreso.fecha_ingreso.split("-");
                          const date = new Date(year, parseInt(month) - 1, day);
                          const monthName = date.toLocaleDateString("es-MX", {
                            month: "short",
                          });
                          return `${day} ${monthName}`;
                        })()}
                      </Text>
                      <Text
                        style={{ flex: 2.5 }}
                        className="p-3 text-slate-800 font-medium"
                      >
                        {currencyFormatter.format(ingreso.monto_ingreso)}
                      </Text>
                      <View
                        style={{ flex: 1, alignItems: "center" }}
                        className="p-3"
                      >
                        <TouchableOpacity onPress={() => onEdit(ingreso)}>
                          <Svg
                            height="20"
                            viewBox="0 -960 960 960"
                            width="20"
                            fill="#6366f1"
                          >
                            <Path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 23 56.5T849-602l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
                          </Svg>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })
          ) : (
            <View className="p-8 items-center justify-center bg-white">
              <Text className="text-slate-500 text-center font-medium">
                No hay ingresos registrados.
              </Text>
              <Text className="text-slate-400 text-center text-sm mt-1">
                Agrega un nuevo ingreso para comenzar.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const ScreenFinanzas = () => {
  const [ingresoRefreshTrigger, setIngresoRefreshTrigger] = useState(0);

  const [loading, setLoading] = useState(false); // Desactivamos la carga por defecto

  // --- Estados para el formulario de Ingresos y su animación ---
  const [isIngresoFormVisible, setIsIngresoFormVisible] = useState(false);
  const [editingIngreso, setEditingIngreso] = useState(null);
  const ingresoFormAnimation = useRef(new Animated.Value(0)).current;

  // --- Estados para los filtros de fecha ---
  const [selectedIngresoDateFilter, setSelectedIngresoDateFilter] =
    useState("last_month");
  const [selectedEgresoDateFilter, setSelectedEgresoDateFilter] =
    useState("last_month");
  const [syncDateFilters, setSyncDateFilters] = useState(false);
  // --- Estados para el formulario de Egresos y su animación ---
  const [isEgresoFormVisible, setIsEgresoFormVisible] = useState(false);
  const [editingEgreso, setEditingEgreso] = useState(null);
  const egresoFormAnimation = useRef(new Animated.Value(0)).current;
  const [egresoRefreshTrigger, setEgresoRefreshTrigger] = useState(0);

  const initialFormState = {
    id: null,
    alumno: "",
    curso: "",
    fechaInicio: new Date().toISOString().split("T")[0],
    asesor: null,
    metodoPago: null,
    importe: "",
    estatus: null,
  };

  const months = [
    { label: "Enero", value: 0 },
    { label: "Febrero", value: 1 },
    { label: "Marzo", value: 2 },
    { label: "Abril", value: 3 },
    { label: "Mayo", value: 4 },
    { label: "Junio", value: 5 },
    { label: "Julio", value: 6 },
    { label: "Agosto", value: 7 },
    { label: "Septiembre", value: 8 },
    { label: "Octubre", value: 9 },
    { label: "Noviembre", value: 10 },
    { label: "Diciembre", value: 11 },
  ];

  // --- Nueva lógica de filtrado de fecha ---
  const [availableYears, setAvailableYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);

  // Función para cargar años disponibles desde Supabase
  const fetchAvailableYears = async () => {
    setLoadingYears(true);
    try {
      // Obtener años de ingresos
      const { data: ingresos, error: ingresosError } = await supabase
        .from("ingresos")
        .select("fecha_ingreso");

      // Obtener años de egresos (solo pagados)
      const { data: egresos, error: egresosError } = await supabase
        .from("egresos")
        .select("fecha_egreso, estado")
        .eq("estado", "pagado"); // Solo egresos pagados

      if (ingresosError || egresosError) {
        console.error("Error fetching years:", ingresosError || egresosError);
        return;
      }

      // Extraer años únicos
      const yearsSet = new Set();

      ingresos?.forEach((item) => {
        if (item.fecha_ingreso) {
          const year = item.fecha_ingreso.split("-")[0];
          yearsSet.add(parseInt(year));
        }
      });

      egresos?.forEach((item) => {
        if (item.fecha_egreso) {
          const year = item.fecha_egreso.split("-")[0];
          yearsSet.add(parseInt(year));
        }
      });

      // Convertir a array y separar por año actual, futuros y pasados
      const currentYear = new Date().getFullYear();
      const yearsArray = Array.from(yearsSet).sort((a, b) => b - a);

      const futureYears = yearsArray
        .filter((year) => year > currentYear)
        .map((year) => ({
          label: String(year),
          value: `year-${year}`,
        }));

      const pastYears = yearsArray
        .filter((year) => year < currentYear)
        .map((year) => ({
          label: String(year),
          value: `year-${year}`,
        }));

      // Construir el array final: futuros, actual (si existe), pasados
      const hasCurrentYear = yearsSet.has(currentYear);
      const currentYearOption = hasCurrentYear
        ? [{ label: "Este año", value: `year-${currentYear}` }]
        : [];

      setAvailableYears([...futureYears, ...currentYearOption, ...pastYears]);
    } catch (error) {
      console.error("Error fetching available years:", error);
    } finally {
      setLoadingYears(false);
    }
  };

  // Cargar años cada vez que se entra a la sección de Finanzas
  useFocusEffect(
    useCallback(() => {
      fetchAvailableYears();
    }, [])
  );

  const dateFilterOptions = [
    { label: "Último mes", value: "last_month" },
    { label: "Hace 3 meses", value: "3_months_ago" },
    ...availableYears,
  ];

  const handleIngresoFilterChange = (item) => {
    setSelectedIngresoDateFilter(item.value);
    if (syncDateFilters) {
      setSelectedEgresoDateFilter(item.value);
    }
  };

  const handleEgresoFilterChange = (item) => {
    setSelectedEgresoDateFilter(item.value);
    if (syncDateFilters) {
      setSelectedIngresoDateFilter(item.value);
    }
  };

  // Formateador de moneda
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const asesores = [
    { label: "Darian Reyes Romero", value: "Darian Reyes Romero" },
    { label: "María López", value: "María López" },
    { label: "Asesor de Prueba", value: "Asesor de Prueba" },
  ];

  const metodosPago = [
    { label: "Efectivo", value: "Efectivo" },
    { label: "Transferencia", value: "Transferencia" },
    { label: "Depósito", value: "Depósito" },
  ];

  const estatusOptions = [
    { label: "Pendiente", value: "Pendiente" },
    { label: "Pagado", value: "Pagado" },
  ];

  const cursos = [
    {
      label: "Entrenamiento para el examen de admision a la universidad",
      value: "Entrenamiento para el examen de admision a la universidad",
    },
    {
      label: "Entrenamiento para el examen de admision a la preparatoria",
      value: "Entrenamiento para el examen de admision a la preparatoria",
    },
  ];

  const handleOpenIngresoForm = (ingreso = null) => {
    setEditingIngreso(ingreso);
    setIsIngresoFormVisible(true);
    Animated.timing(ingresoFormAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseIngresoForm = (savedData, wasSaved) => {
    const closeAction = () => {
      Animated.timing(ingresoFormAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsIngresoFormVisible(false);
        setEditingIngreso(null);
        // Actualizamos datos si se guardó
        // Always refresh when closing the form
        setIngresoRefreshTrigger((prev) => prev + 1);
      });
    };

    closeAction();
  };

  const handleOpenEgresoForm = (egreso = null) => {
    setEditingEgreso(egreso);
    setIsEgresoFormVisible(true);
    Animated.timing(egresoFormAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseEgresoForm = (savedData, wasSaved) => {
    const closeAction = () => {
      Animated.timing(egresoFormAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsEgresoFormVisible(false);
        setEditingEgreso(null);
        // Actualizamos datos si se guardó
        // Always refresh when closing the form
        setEgresoRefreshTrigger((prev) => prev + 1);
      });
    };
    closeAction();
  };

  const { height } = useWindowDimensions();
  const formContainerStyle = (animation) => ({
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [height, 0],
        }),
      },
    ],
  });

  const isAnyFormVisible = isIngresoFormVisible || isEgresoFormVisible;

  const renderCell = (data, cellInfo, index) => {
    const field = cellInfo.field;

    // Renderizado de celdas en modo de solo lectura
    switch (field) {
      case "importe":
        return (
          <Text style={styles.tableText}>
            {currencyFormatter.format(data[field])}
          </Text>
        );
      case "actions":
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => handleOpenForm("edit", data)}>
              <Svg
                height="22"
                viewBox="0 -960 960 960"
                width="22"
                fill="#3b82f6"
              >
                <Path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 23 56.5T849-602l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
              </Svg>
            </TouchableOpacity>
            {/* Aquí podrías agregar un botón de eliminar si lo necesitas */}
          </View>
        );
      default:
        return <Text style={styles.tableText}>{data[field]}</Text>;
    }
  };

  const tableHeaders = [
    { title: "ID", field: "id", width: 40 },
    {
      title: "Nombre del alumno",
      field: "alumno",
      width: 200,
      placeholder: "Nombre",
    },
    {
      title: "Curso/Asesoría",
      field: "curso",
      width: 220,
      placeholder: "Curso",
    },
    { title: "Fecha de inicio", field: "fechaInicio", width: 120 },
    {
      title: "Asesor",
      field: "asesor",
      width: 150,
      options: asesores,
      placeholder: "Asesor",
    },
    {
      title: "Método de pago",
      field: "metodoPago",
      width: 120,
      options: metodosPago,
      placeholder: "Método",
    },
    { title: "Importe", field: "importe", width: 100 },
    {
      title: "Estatus",
      field: "estatus",
      width: 120,
      options: estatusOptions,
      placeholder: "Estatus",
    },
    { title: "Acciones", field: "actions", width: 100 },
  ];

  return (
    // Contenedor principal para la pantalla de Finanzas
    <Tab.Navigator
      initialRouteName="Ingresos"
      tabBarPosition="top"
      tabBar={(props) => (
        <CustomFinanzasTabBar
          {...props}
          screenProps={{
            syncDateFilters,
            setSyncDateFilters,
            selectedIngresoDateFilter,
            setSelectedEgresoDateFilter,
          }}
        />
      )}
      screenOptions={{
        swipeEnabled: !isAnyFormVisible, // Deshabilita swipe si hay un formulario abierto
      }}
      screenListeners={{
        focus: () => {
          // Ejecutar fetch cada vez que se cambia de pestaña
          fetchAvailableYears();
        },
      }}
    >
      <Tab.Screen name="Ingresos" key="ingresos-tab">
        {/* Añadido key para claridad */}
        {() => (
          <View
            id="tablas-ingresos"
            className={`flex-1 bg-slate-50 p-4 relative`}
          >
            {loading && (
              <View className="absolute inset-0 bg-white/70 justify-center items-center z-10">
                <ActivityIndicator size="large" color="#6F09EA" />
                <Text className="mt-2 text-slate-600">
                  Cargando ingresos...
                </Text>
              </View>
            )}

            <View
              className="flex-row justify-between items-center mb-4"
              style={{ opacity: isAnyFormVisible ? 0.5 : 1 }}
              pointerEvents={isAnyFormVisible ? "none" : "auto"}
            >
              <View className="w-60">
                {/* Contenedor para el Dropdown de Ingresos */}
                <Dropdown
                  style={[
                    styles.dropdownIngresos,
                    loadingYears && { opacity: 0.5 },
                  ]}
                  containerStyle={loadingYears && { opacity: 0.5 }}
                  data={dateFilterOptions}
                  labelField="label"
                  valueField="value"
                  placeholder={
                    loadingYears ? "Cargando..." : "Seleccionar filtro"
                  }
                  value={selectedIngresoDateFilter}
                  onChange={handleIngresoFilterChange}
                  disable={loadingYears}
                />
              </View>

              <TouchableOpacity
                onPress={() => handleOpenIngresoForm()}
                className="bg-indigo-600 p-2 rounded-full shadow-md shadow-indigo-600/30 flex-row items-center px-4"
              >
                <Svg
                  height="18"
                  viewBox="0 -960 960 960"
                  width="18"
                  fill="#ffffff"
                >
                  <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </Svg>
                <Text className="text-white font-bold ml-2">
                  Agregar Ingreso
                </Text>
              </TouchableOpacity>
            </View>

            <TablaIngresos
              onEdit={(ingreso) => handleOpenIngresoForm(ingreso)}
              refreshTrigger={ingresoRefreshTrigger}
              dateFilter={selectedIngresoDateFilter}
            />
            {isIngresoFormVisible && (
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  formContainerStyle(ingresoFormAnimation),
                ]}
                className="absolute inset-0 z-10 bg-slate-50"
              >
                <RegistroIngreso
                  key={editingIngreso ? `edit-${editingIngreso.id}` : "new"}
                  ingresoToEdit={editingIngreso}
                  onFormClose={handleCloseIngresoForm}
                />
              </Animated.View>
            )}
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen name="Egresos" key="egresos-tab">
        {/* Añadido key para claridad */}
        {() => (
          <View
            id="tablas-egresos"
            className={`flex-1 bg-slate-50 p-4 relative`}
          >
            {loading && (
              <View className="absolute inset-0 bg-white/70 justify-center items-center z-10">
                <ActivityIndicator size="large" color="#6F09EA" />
                <Text className="mt-2 text-slate-600">Cargando egresos...</Text>
              </View>
            )}

            <View
              className="flex-row justify-between items-center mb-4"
              style={{ opacity: isAnyFormVisible ? 0.5 : 1 }}
              pointerEvents={isAnyFormVisible ? "none" : "auto"}
            >
              <View className="w-60">
                {/* Contenedor para el Dropdown de Egresos */}
                <Dropdown
                  style={[
                    styles.dropdownIngresos,
                    loadingYears && { opacity: 0.5 },
                  ]}
                  containerStyle={loadingYears && { opacity: 0.5 }}
                  data={dateFilterOptions}
                  labelField="label"
                  valueField="value"
                  placeholder={
                    loadingYears ? "Cargando..." : "Seleccionar filtro"
                  }
                  value={selectedEgresoDateFilter}
                  onChange={handleEgresoFilterChange}
                  disable={loadingYears}
                />
              </View>

              <TouchableOpacity
                onPress={() => handleOpenEgresoForm()}
                className="bg-red-600 p-2 rounded-full shadow-md shadow-red-600/30 flex-row items-center px-4"
              >
                <Svg
                  height="18"
                  viewBox="0 -960 960 960"
                  width="18"
                  fill="#ffffff"
                >
                  <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </Svg>
                <Text className="text-white font-bold ml-2">
                  Agregar Egreso
                </Text>
              </TouchableOpacity>
            </View>

            <TablaEgresos
              onEdit={(egreso) => handleOpenEgresoForm(egreso)}
              refreshTrigger={egresoRefreshTrigger}
              dateFilter={selectedEgresoDateFilter}
            />
            {isEgresoFormVisible && (
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  formContainerStyle(egresoFormAnimation),
                ]}
                className="absolute inset-0 z-10 bg-slate-50"
              >
                <RegistroEgreso
                  key={editingEgreso ? `edit-${editingEgreso.id}` : "new"}
                  egresoToEdit={editingEgreso}
                  onFormClose={handleCloseEgresoForm}
                />
              </Animated.View>
            )}
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen name="Reportes" key="reportes-tab">
        {() => <SeccionReportes />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const ScreenCalendario = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  // --- Constante para el ancho del calendario ---
  const CALENDAR_WIDTH = 400;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // --- Estados para el modal de inputs en landscape ---
  const [modalInputVisible, setModalInputVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldLabel, setFieldLabel] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [inputProps, setInputProps] = useState({});

  // --- Estados para el modal de eventos ---
  const [isAddingEvent, setIsAddingEvent] = useState(false); // Controla la vista del formulario
  const [refreshing, setRefreshing] = useState(false); // Estado para el pull-to-refresh
  const [editingEventId, setEditingEventId] = useState(null); // ID del evento en edición
  const [newEvent, setNewEvent] = useState({
    nombre: "",
    descripcion: "",
    hora: "09",
    minutos: "00",
  });
  const [dateParts, setDateParts] = useState({ day: "", month: "", year: "" });
  const [isDateEditable, setIsDateEditable] = useState(false);
  const [isTimeEditable, setIsTimeEditable] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);

  // Filtrar eventos según el toggle de eventos pasados
  const visibleEvents = useMemo(() => {
    if (showPastEvents) return allEvents;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear hora para comparar solo fechas

    return allEvents.filter((evento) => {
      if (!evento.fechayhora_evento) return true; // Si no tiene fecha, mostrarlo por si acaso
      const eventDate = new Date(evento.fechayhora_evento);
      return eventDate >= today;
    });
  }, [allEvents, showPastEvents]);

  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);

  // Efecto para sincronizar los inputs de fecha cuando cambia la fecha del calendario
  useEffect(() => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split("-");
      // Solo actualiza si los valores son diferentes para evitar un bucle
      if (
        dateParts.year !== year ||
        dateParts.month !== month ||
        dateParts.day !== day
      ) {
        setDateParts({ year, month, day });
      }
    }
  }, [selectedDate]);
  // Efecto para sincronizar el input de fecha con el estado del calendario
  useEffect(() => {
    const { day, month, year } = dateParts;
    // Solo proceder si tenemos una fecha completa y válida
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      const newDateString = `${year}-${month}-${day}`;
      // Validar que la fecha construida sea una fecha real (evita ej. 31/02/2024)
      const d = new Date(newDateString);
      if (d && d.toISOString().slice(0, 10) === newDateString) {
        // Solo actualiza si la fecha es diferente para evitar bucles infinitos
        if (newDateString !== selectedDate) {
          setSelectedDate(newDateString);
        }
      }
    }
  }, [dateParts]); // Se ejecuta cada vez que cambia la fecha en los inputs

  const handleDatePartChange = (part, value) => {
    const numericValue = value.replace(/[^\d]/g, "");
    let newParts = { ...dateParts, [part]: numericValue };

    // Validaciones y auto-focus
    if (part === "day") {
      if (parseInt(numericValue, 10) > 31) newParts.day = "31";
      if (numericValue.length === 2) monthInputRef.current?.focus();
    }
    if (part === "month") {
      if (parseInt(numericValue, 10) > 12) newParts.month = "12";
      if (numericValue.length === 2) yearInputRef.current?.focus();
    }
    if (part === "year" && numericValue.length === 4) {
      Keyboard.dismiss();
    }

    setDateParts(newParts);
  };

  const handleInputPress = (field, label, value, props = {}) => {
    setEditingField(field);
    setFieldLabel(label);
    setCurrentValue(value);
    setInputProps(props);
    setModalInputVisible(true);
  };

  const openAddEventForm = () => {
    // Captura la hora y minutos actuales al abrir el modal
    const now = new Date();
    const currentHour = String(now.getHours()).padStart(2, "0");
    const currentMinutes = now.getMinutes();

    // Redondea los minutos al intervalo de 15 más cercano (00, 15, 30, 45)
    let closestMinute = "00";
    if (currentMinutes >= 45) {
      closestMinute = "45";
    } else if (currentMinutes >= 30) {
      closestMinute = "30";
    } else if (currentMinutes >= 15) {
      closestMinute = "15";
    }

    // Al abrir el modal, poblamos la fecha con la seleccionada en el calendario
    const parts = selectedDate.split("-");
    setDateParts({ year: parts[0], month: parts[1], day: parts[2] });
    setIsDateEditable(false); // La fecha no es editable por defecto
    setIsTimeEditable(false); // La hora tampoco es editable por defecto
    setNewEvent({
      nombre: "",
      descripcion: "",
      hora: currentHour,
      minutos: closestMinute,
    });
    setEditingEventId(null);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setIsAddingEvent(true); // Muestra el formulario en línea
  };

  const handleSaveEvent = () => {
    submitEvento();
  };

  const handleCancelEvent = () => {
    // Simplemente oculta el formulario sin guardar
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setIsAddingEvent(false);
    setEditingEventId(null);
    setNewEvent({
      nombre: "",
      descripcion: "",
      hora: "09",
      minutos: "00",
    });
    handleRefresh(); // Refrescar datos al cerrar el formulario
  };

  const handleEditEvent = (evento) => {
    // Parsear el timestamp en formato local
    // Formato esperado: "YYYY-MM-DD HH:MM:SS" o "YYYY-MM-DDTHH:MM:SS"
    const timestampStr = evento.fechayhora_evento
      .replace("T", " ")
      .split(".")[0];
    const [datePart, timePart] = timestampStr.split(" ");
    const [year, month, day] = datePart.split("-");

    let hours = "09",
      minutes = "00";
    if (timePart) {
      const [h, m] = timePart.split(":");
      hours = h.padStart(2, "0");
      minutes = m.padStart(2, "0");
    }

    setNewEvent({
      nombre: evento.nombre_evento,
      descripcion: evento.detalles_evento,
      hora: hours,
      minutos: minutes,
    });

    setDateParts({ year, month, day });
    setSelectedDate(`${year}-${month}-${day}`);
    setEditingEventId(evento.id_evento);
    setIsAddingEvent(true);
  };

  const calendarRef = useRef(null);

  // Función para volver al día y mes actual
  const goToToday = () => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, "0");
    const day = String(todayDate.getDate()).padStart(2, "0");
    const today = `${year}-${month}-${day}`;
    setSelectedDate(today);
  };

  LocaleConfig.locales["es"] = {
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    monthNamesShort: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    dayNames: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ],
    dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    today: "Hoy",
    now: "Ahora",
    am: "AM",
    pm: "PM",
  };

  LocaleConfig.defaultLocale = "es";

  // Objeto para marcar la fecha seleccionada
  // Objeto para marcar la fecha seleccionada y fechas con eventos
  const markedDates = useMemo(() => {
    const marks = {
      [selectedDate]: {
        selected: true,
        selectedColor: "#6F09EA",
        disableTouchEvent: true,
      },
    };

    allEvents.forEach((event) => {
      if (event.fechayhora_evento) {
        const dateKey = event.fechayhora_evento.split("T")[0];
        // Si la fecha ya está marcada como seleccionada, no la sobrescribimos, pero podríamos añadir dots
        if (dateKey !== selectedDate) {
          marks[dateKey] = {
            marked: true,
            dotColor: event.tipo === "egreso" ? "#f59e0b" : "#6F09EA", // Naranja para egresos, Morado para eventos
          };
        }
      }
    });

    return marks;
  }, [selectedDate, allEvents]);

  async function submitEvento() {
    // Validar que el nombre no esté vacío
    if (!newEvent.nombre.trim()) {
      Alert.alert("Error", "El nombre del evento es obligatorio");
      return;
    }

    // Parsear la fecha seleccionada
    const [year, month, day] = selectedDate.split("-").map(Number);
    const hora = parseInt(newEvent.hora, 10);
    const minutos = parseInt(newEvent.minutos, 10);

    // Crear un objeto Date en hora local
    const fechaLocal = new Date(year, month - 1, day, hora, minutos, 0);

    // Formatear como timestamp para PostgreSQL en formato local
    // PostgreSQL espera formato: YYYY-MM-DD HH:MM:SS
    const yearStr = fechaLocal.getFullYear();
    const monthStr = String(fechaLocal.getMonth() + 1).padStart(2, "0");
    const dayStr = String(fechaLocal.getDate()).padStart(2, "0");
    const horaStr = String(fechaLocal.getHours()).padStart(2, "0");
    const minutosStr = String(fechaLocal.getMinutes()).padStart(2, "0");
    const segundosStr = String(fechaLocal.getSeconds()).padStart(2, "0");

    const fechaCompleta = `${yearStr}-${monthStr}-${dayStr} ${horaStr}:${minutosStr}:${segundosStr}`;

    let error;

    if (editingEventId) {
      // Actualizar
      const { error: updateError } = await supabase
        .from("eventos_calendario")
        .update({
          nombre_evento: newEvent.nombre,
          detalles_evento: newEvent.descripcion,
          fechayhora_evento: fechaCompleta,
        })
        .eq("id_evento", editingEventId);
      error = updateError;
    } else {
      // Insertar
      const { error: insertError } = await supabase
        .from("eventos_calendario")
        .insert([
          {
            nombre_evento: newEvent.nombre,
            detalles_evento: newEvent.descripcion,
            fechayhora_evento: fechaCompleta,
          },
        ]);
      error = insertError;
    }

    if (error) {
      Alert.alert(
        "Error",
        `No pudo ${editingEventId ? "actualizarse" : "crearse"} el evento`
      );
    } else {
      setIsAddingEvent(false);
      setEditingEventId(null);
      setNewEvent({ nombre: "", descripcion: "", hora: "09", minutos: "00" });
      handleRefresh();

      Alert.alert(
        "Éxito",
        `Evento ${editingEventId ? "actualizado" : "creado"} correctamente`
      );
    }
  }

  const handleRefresh = async () => {
    if (isRefetching || loading) return;
    setIsRefetching(true);
    await fetchEvento();
    setTimeout(() => setIsRefetching(false), 300);
  };

  async function fetchEvento() {
    try {
      // 1. Fetch eventos normales del calendario
      const { data: eventos, error: errorEventos } = await supabase
        .from("eventos_calendario")
        .select("*")
        .order("fechayhora_evento", { ascending: true });

      if (errorEventos) {
        console.error("Error fetching events:", errorEventos);
        Alert.alert("Error", "No se pudieron cargar los eventos");
        return;
      }

      // 2. Fetch egresos pendientes
      const { data: egresos, error: errorEgresos } = await supabase
        .from("egresos")
        .select("*")
        .eq("estado", "pendiente");

      if (errorEgresos) {
        console.error("Error fetching pending expenses:", errorEgresos);
      }

      // 3. Formatear egresos como eventos
      const egresosComoEventos = (egresos || []).map((egreso) => ({
        id_evento: `egreso-${egreso.id}`, // ID único con prefijo
        nombre_evento: `Pago Recurrente: ${egreso.nombre_egreso}`,
        detalles_evento: `Monto: $${egreso.monto_egreso} - ${egreso.desc_egreso}`,
        fechayhora_evento: `${egreso.fecha_egreso}T09:00:00`, // Asumimos 9 AM por defecto para visualización
        tipo: "egreso", // Identificador para lógica de UI
        originalData: egreso, // Guardamos datos originales por si acaso
      }));

      // 4. Combinar y ordenar ambos tipos
      const todos = [...(eventos || []), ...egresosComoEventos].sort((a, b) => {
        const dateA = new Date(a.fechayhora_evento);
        const dateB = new Date(b.fechayhora_evento);
        return dateA - dateB;
      });

      setAllEvents(todos);
    } catch (err) {
      console.error("Unexpected error in fetchEvento:", err);
    } finally {
      setRefreshing(false);
      setLoading(false);
      setIsRefetching(false);
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleRefresh();
  }, []);

  const handleDeleteEvent = (id) => {
    Alert.alert(
      "Eliminar Evento",
      "¿Estás seguro de que quieres eliminar este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("eventos_calendario")
              .delete()
              .eq("id_evento", id);

            if (error) {
              Alert.alert("Error", "No se pudo eliminar el evento");
              console.error(error);
            } else {
              handleRefresh(); // Recargar la lista
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      const loadEvents = async () => {
        if (allEvents.length > 0) {
          setIsRefetching(true);
        } else {
          setLoading(true);
        }
        await fetchEvento();
      };
      loadEvents();
    }, [])
  );

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS !== "web" ? Keyboard.dismiss : ""}
    >
      <View
        className={`flex-1 lg:flex-row gap-6 p-4 lg:items-stretch`} // Usamos clases lg: para responsividad en web/tablets
      >
        {/* Contenedor del Calendario */}
        <View
          id="contendor-calendario"
          className={`flex items-center ${isLandscape ? "" : "w-full"}`}
        >
          <View
            className={`bg-white rounded-xl shadow-sm border ${isLandscape ? "h-full" : ""} border-slate-200 p-4`}
            style={{
              width: CALENDAR_WIDTH,
            }}
          >
            <Calendar
              // Props para el calendario
              ref={calendarRef}
              current={selectedDate} // Controlamos el mes visible con 'current'
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              enableSwipeMonths={true}
              showSixWeeks
              style={{
                // El estilo ahora es más limpio, controlado por el contenedor
                backgroundColor: "transparent",
              }}
              theme={{
                // Tema visual del calendario
                calendarBackground: "transparent",
                textSectionTitleColor: "#64748b",
                selectedDayBackgroundColor: "#6F09EA",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#6F09EA",
                dayTextColor: "#1e293b",
                textDisabledColor: "#9ca3af",
                arrowColor: "#6F09EA",
                monthTextColor: "#1e293b",
                textDayFontWeight: "500",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "600",
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              renderHeader={(date) => {
                const month = date.toString("MMMM yyyy");
                return (
                  <View className="flex-row justify-center relative px-10">
                    {/* El título del mes se centra automáticamente */}
                    <Text className="text-lg font-bold text-slate-800 capitalize">
                      {month}
                    </Text>
                    {/* Botón "Hoy" con posicionamiento absoluto */}
                    <TouchableOpacity
                      onPress={goToToday}
                      className="bg-indigo-100 px-3 py-1 rounded-full absolute"
                      style={{ top: 0, right: -30 }}
                    >
                      <Text className="font-bold text-sm text-indigo-600">
                        Hoy
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        </View>

        {/* Contenedor de Eventos */}
        <KeyboardAvoidingView
          id="keyboard-avoiding-calendario-form"
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : isLandscape
                ? "padding"
                : "height"
          }
          style={{ flex: 1 }}
          keyboardVerticalOffset={
            Platform.OS === "ios" ? 90 : isLandscape ? 100 : 100
          }
        >
          <View className="bg-white rounded-xl w-full h-full shadow-sm border border-slate-200 p-4">
            {/* Cabecera de la sección de eventos */}
            <View
              className={`flex-row justify-between items-center border-b border-slate-200 pb-3 mb-4`}
            >
              <Text className="text-lg font-bold text-slate-800">
                Próximos eventos
              </Text>
              <TouchableOpacity
                onPress={isAddingEvent ? handleCancelEvent : openAddEventForm}
                className={`bg-indigo-600 p-2 rounded-full shadow-md shadow-indigo-600/30 flex-row items-center ${isAddingEvent ? "px-2" : "px-3"}`}
              >
                {isAddingEvent ? (
                  <Svg
                    height="18"
                    viewBox="0 -960 960 960"
                    width="18"
                    fill="#ffffff"
                  >
                    <Path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                  </Svg>
                ) : (
                  <>
                    <Svg
                      height="16"
                      viewBox="0 -960 960 960"
                      width="16"
                      fill="#ffffff"
                    >
                      <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </Svg>
                    <Text className="text-white font-bold ml-2 text-sm">
                      Agregar
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Toggle para mostrar/ocultar eventos pasados */}
            {!isAddingEvent && (
              <View className="flex-row items-center justify-end mb-2">
                <Text className="text-xs text-slate-500 mr-2">
                  Ver eventos pasados
                </Text>
                <Switch
                  trackColor={{ false: "#e2e8f0", true: "#c7d2fe" }}
                  thumbColor={showPastEvents ? "#6366f1" : "#f1f5f9"}
                  ios_backgroundColor="#e2e8f0"
                  onValueChange={setShowPastEvents}
                  value={showPastEvents}
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                />
              </View>
            )}

            {isAddingEvent ? (
              // --- FORMULARIO PARA AGREGAR EVENTO ---
              <ScrollView className="p-2">
                <Text className="text-xl font-bold mb-4 text-slate-800">
                  {editingEventId ? "Editar Evento" : "Agregar Evento"}
                </Text>

                {/* Campo Nombre del Evento */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-sm font-semibold text-slate-700">
                      Nombre del Evento
                    </Text>
                    <Text className="text-red-500 ml-1">*</Text>
                  </View>
                  <TextInput
                    className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white"
                    placeholder="Ej. Reunión de equipo"
                    value={newEvent.nombre}
                    onChangeText={(text) =>
                      setNewEvent((prev) => ({ ...prev, nombre: text }))
                    }
                  />
                </View>

                {/* Campo de Fecha */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-sm font-semibold text-slate-700">
                      Fecha del Evento
                    </Text>
                    <TouchableOpacity
                      onPress={() => setIsDateEditable(!isDateEditable)}
                      className="ml-2 p-1 rounded-full bg-slate-200"
                    >
                      <Svg
                        height="14"
                        viewBox="0 -960 960 960"
                        width="14"
                        fill="#475569"
                      >
                        <Path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 23 56.5T849-602l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  <View
                    className={`flex-row items-center border border-slate-300 rounded-xl p-1 ${isDateEditable ? "bg-white" : "bg-slate-100 opacity-70"}`}
                  >
                    <TextInput
                      style={styles_registro_venta.dateInput}
                      placeholder="DD"
                      value={dateParts.day}
                      editable={isDateEditable}
                      onChangeText={(text) => handleDatePartChange("day", text)}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text style={styles.dateSeparator}>/</Text>
                    <TextInput
                      ref={monthInputRef}
                      style={styles_registro_venta.dateInput}
                      placeholder="MM"
                      value={dateParts.month}
                      editable={isDateEditable}
                      onChangeText={(text) =>
                        handleDatePartChange("month", text)
                      }
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text style={styles.dateSeparator}>/</Text>
                    <TextInput
                      ref={yearInputRef}
                      style={[styles_registro_venta.dateInput, { flex: 1.5 }]}
                      placeholder="AAAA"
                      value={dateParts.year}
                      editable={isDateEditable}
                      onChangeText={(text) =>
                        handleDatePartChange("year", text)
                      }
                      keyboardType="number-pad"
                      maxLength={4}
                    />
                  </View>
                </View>

                {/* Selector de Hora */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-sm font-semibold text-slate-700">
                      Hora del Evento (Formato 24HH)
                    </Text>
                    <TouchableOpacity
                      onPress={() => setIsTimeEditable(!isTimeEditable)}
                      className="ml-2 p-1 rounded-full bg-slate-200"
                    >
                      <Svg
                        height="14"
                        viewBox="0 -960 960 960"
                        width="14"
                        fill="#475569"
                      >
                        <Path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 23 56.5T849-602l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  <View
                    className={`flex-row items-center border border-slate-300 rounded-xl p-1 ${isTimeEditable ? "bg-white" : "bg-slate-100 opacity-70"}`}
                  >
                    <TextInput
                      className="flex-1 text-center text-base py-2"
                      placeholder="HH"
                      value={newEvent.hora}
                      editable={isTimeEditable}
                      onChangeText={(text) => {
                        // Solo permitir números
                        const numericValue = text.replace(/[^0-9]/g, "");
                        // Validar que esté entre 00 y 23
                        if (numericValue === "" || numericValue.length === 1) {
                          setNewEvent((prev) => ({
                            ...prev,
                            hora: numericValue,
                          }));
                        } else if (numericValue.length === 2) {
                          const hourValue = parseInt(numericValue, 10);
                          if (hourValue >= 0 && hourValue <= 23) {
                            setNewEvent((prev) => ({
                              ...prev,
                              hora: numericValue,
                            }));
                          }
                        }
                      }}
                      onBlur={() => {
                        // Agregar cero a la izquierda si es necesario
                        if (newEvent.hora.length === 1) {
                          setNewEvent((prev) => ({
                            ...prev,
                            hora: prev.hora.padStart(2, "0"),
                          }));
                        }
                      }}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text className="text-xl font-bold text-slate-400">:</Text>
                    <TextInput
                      className="flex-1 text-center text-base py-2"
                      placeholder="MM"
                      value={newEvent.minutos}
                      editable={isTimeEditable}
                      onChangeText={(text) => {
                        // Solo permitir números
                        const numericValue = text.replace(/[^0-9]/g, "");
                        // Validar que esté entre 00 y 59
                        if (numericValue === "" || numericValue.length === 1) {
                          setNewEvent((prev) => ({
                            ...prev,
                            minutos: numericValue,
                          }));
                        } else if (numericValue.length === 2) {
                          const minuteValue = parseInt(numericValue, 10);
                          if (minuteValue >= 0 && minuteValue <= 59) {
                            setNewEvent((prev) => ({
                              ...prev,
                              minutos: numericValue,
                            }));
                          }
                        }
                      }}
                      onBlur={() => {
                        // Agregar cero a la izquierda si es necesario
                        if (newEvent.minutos.length === 1) {
                          setNewEvent((prev) => ({
                            ...prev,
                            minutos: prev.minutos.padStart(2, "0"),
                          }));
                        }
                      }}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                </View>

                {/* Campo Descripción */}
                <LabeledInput
                  label="Descripción (Opcional)"
                  containerClassName="mb-4"
                >
                  <TextInput
                    placeholder="Detalles adicionales sobre el evento..."
                    className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white h-20"
                    style={{ textAlignVertical: "top" }}
                    multiline
                    value={newEvent.descripcion}
                    onChangeText={(text) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        descripcion: text,
                      }))
                    }
                  />
                </LabeledInput>

                {/* Botones de Acción */}
                <View className="flex-row justify-end mt-4 gap-x-4">
                  <TouchableOpacity
                    onPress={handleCancelEvent}
                    className="bg-slate-200 px-5 py-3 rounded-lg"
                  >
                    <Text className="font-bold text-slate-600">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveEvent}
                    disabled={!newEvent.nombre.trim()}
                    style={[
                      {
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        borderRadius: 8,
                      },
                      newEvent.nombre.trim()
                        ? {
                            backgroundColor: "#6366f1",
                            shadowColor: "#6366f1",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 4,
                          }
                        : { backgroundColor: "#cbd5e1" },
                    ]}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: newEvent.nombre.trim() ? "#ffffff" : "#64748b",
                      }}
                    >
                      {editingEventId ? "Actualizar" : "Guardar Evento"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              // --- VISTA POR DEFECTO (LISTA DE EVENTOS O MENSAJE) ---

              <View className="flex-1 relative">
                {loading ? (
                  <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#6F09EA" />
                  </View>
                ) : (
                  <>
                    <View
                      className="flex-1"
                      style={{ opacity: isRefetching ? 0.5 : 1 }}
                    >
                      <ScrollView
                        className="flex-1"
                        contentContainerStyle={{
                          paddingBottom: 20,
                          flexGrow: 1,
                        }}
                        nestedScrollEnabled={true}
                        scrollEventThrottle={16}
                        refreshControl={
                          <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={handleRefresh}
                            tintColor="#6F09EA"
                            colors={["#6F09EA"]}
                          />
                        }
                      >
                        {visibleEvents.length > 0 ? (
                          visibleEvents.map((evento, index) => (
                            <Pressable
                              key={evento.id_evento || index}
                              onPress={() => {
                                if (evento.tipo !== "egreso") {
                                  handleEditEvent(evento);
                                }
                              }}
                              android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                              className={`p-4 mb-3 bg-slate-50 rounded-xl border-l-4 shadow-sm border-l-indigo-500 ${
                                evento.tipo === "egreso"
                                  ? "border-amber-200"
                                  : "border-indigo-500"
                              }`}
                              style={{
                                borderWidth: 0,
                                borderLeftWidth: 4,
                                borderColor:
                                  evento.tipo === "egreso"
                                    ? "#fcd34d"
                                    : "#6366f1", // Amber-300 para egresos, Indigo-500 para normales
                                borderLeftColor: "#6366f1", // Siempre Indigo-500
                              }}
                            >
                              <View className="flex-row justify-between items-start">
                                <View className="flex-1">
                                  <Text className="font-bold text-base text-slate-800 mb-1">
                                    {evento.nombre_evento}
                                  </Text>
                                  <Text className="text-slate-600 text-sm mb-2 leading-relaxed">
                                    {evento.detalles_evento}
                                  </Text>
                                  <View className="flex-row items-center">
                                    {/* Icono dinámico según tipo */}
                                    {evento.tipo === "egreso" ? (
                                      <Svg
                                        height="14"
                                        width="14"
                                        viewBox="0 -960 960 960"
                                        fill="#f59e0b"
                                        className="mr-1"
                                      >
                                        <Path d="M440-120v-80h80v80h-80Zm0-320v-80h80v80h-80Zm0-320v-80h80v80h-80ZM200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 23 56.5T849-602l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
                                      </Svg>
                                    ) : (
                                      <Svg
                                        height="14"
                                        width="14"
                                        viewBox="0 -960 960 960"
                                        fill="#94a3b8"
                                        className="mr-1"
                                      >
                                        <Path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
                                      </Svg>
                                    )}

                                    <Text
                                      className={`text-xs font-medium ${evento.tipo === "egreso" ? "text-amber-600" : "text-slate-500"}`}
                                    >
                                      {(() => {
                                        if (!evento.fechayhora_evento)
                                          return "";

                                        // Parsear el timestamp en formato local
                                        // Formato esperado: "YYYY-MM-DD HH:MM:SS"
                                        const timestampStr =
                                          evento.fechayhora_evento
                                            .replace("T", " ")
                                            .split(".")[0];
                                        const [datePart, timePart] =
                                          timestampStr.split(" ");
                                        const [year, month, day] = datePart
                                          .split("-")
                                          .map(Number);

                                        let hours = 0,
                                          minutes = 0;
                                        if (timePart) {
                                          const [h, m] = timePart
                                            .split(":")
                                            .map(Number);
                                          hours = h;
                                          minutes = m;
                                        }

                                        const dayStr = String(day).padStart(
                                          2,
                                          "0"
                                        );
                                        const monthStr = String(month).padStart(
                                          2,
                                          "0"
                                        );
                                        const hoursStr = String(hours).padStart(
                                          2,
                                          "0"
                                        );
                                        const minutesStr = String(
                                          minutes
                                        ).padStart(2, "0");

                                        // Para egresos, solo mostramos fecha, no hora (ya que es ficticia)
                                        if (evento.tipo === "egreso") {
                                          return `${dayStr}/${monthStr}/${year} (Próximo pago)`;
                                        }
                                        return `${dayStr}/${monthStr}/${year} ${hoursStr}:${minutesStr}`;
                                      })()}
                                    </Text>
                                  </View>
                                </View>

                                {/* Botones de acción solo para eventos normales */}
                                {evento.tipo !== "egreso" && (
                                  <View className="flex-row items-center ml-2">
                                    <TouchableOpacity
                                      onPress={() => handleEditEvent(evento)}
                                      className="p-2 opacity-60"
                                    >
                                      <Svg
                                        height="20"
                                        viewBox="0 -960 960 960"
                                        width="20"
                                        fill="#64748b"
                                      >
                                        <Path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                                      </Svg>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleDeleteEvent(evento.id_evento)
                                      }
                                      className="p-2 ml-1 opacity-60"
                                    >
                                      <Svg
                                        height="20"
                                        viewBox="0 -960 960 960"
                                        width="20"
                                        fill="#64748b"
                                      >
                                        <Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                      </Svg>
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </View>
                            </Pressable>
                          ))
                        ) : (
                          <View className="flex-1 justify-center items-center">
                            <Svg
                              height="60"
                              viewBox="0 -960 960 960"
                              width="60"
                              fill="#cbd5e1"
                            >
                              <Path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
                            </Svg>
                            <Text className="text-slate-500 font-semibold mt-4 text-center">
                              No hay eventos registrados.
                            </Text>
                            <Text className="text-slate-400 text-sm mt-1 text-center">
                              Agrega un nuevo evento para comenzar.
                            </Text>
                          </View>
                        )}
                      </ScrollView>
                    </View>
                    {isRefetching && (
                      <View
                        style={StyleSheet.absoluteFill}
                        className="absolute inset-0 bg-white/50 flex items-center justify-center"
                      >
                        <ActivityIndicator size="large" color="#6F09EA" />
                      </View>
                    )}
                  </>
                )}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const TablaCursos = ({
  data,
  loading = loading,
  query = "",
  isRefetching = false,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const [sortKey, setSortKey] = useState("id_curso");
  const [sortDir, setSortDir] = useState("asc");

  const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = data.filter((r) => {
      if (!q) return true;
      const nombre = String(r.nombre_curso || "").toLowerCase();
      const precio = String(r.costo_curso || "").toLowerCase();
      return nombre.includes(q) || precio.includes(q);
    });
    const sorted = [...arr].sort((a, b) => {
      let va = a[sortKey] ?? "";
      let vb = b[sortKey];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, query, sortKey, sortDir]);

  const SortHeader = ({ label, k, flex = 1, center }) => (
    <Pressable
      onPress={() => {
        setSortKey(k);
        setSortDir((d) =>
          sortKey === k ? (d === "asc" ? "desc" : "asc") : "asc"
        );
      }}
      className="py-3 px-3"
      style={{ flex, alignItems: center ? "center" : "flex-start" }}
      android_ripple={{ color: "rgba(0,0,0,0.05)" }}
    >
      <View className="flex-row items-center gap-1">
        <Text className="text-slate-800 font-semibold text-xs sm:text-sm uppercase tracking-wide">
          {label}
        </Text>
        {sortKey === k && (
          <Svg width={12} height={12} viewBox="0 -960 960 960" fill="#334155">
            {sortDir === "asc" ? (
              <Path d="M480-680 240-440h480L480-680Z" />
            ) : (
              <Path d="M240-520h480L480-280 240-520Z" />
            )}
          </Svg>
        )}
      </View>
    </Pressable>
  );

  return (
    <View className={`px-2 pb-4 relative flex-1`}>
      <View
        className={`rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm ${Platform.OS == "web" ? "flex-1" : ""}`}
        style={{ opacity: isRefetching ? 0.5 : 1 }}
      >
        <ScrollView
          stickyHeaderIndices={[0]}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              tintColor="#6F09EA"
            />
          }
        >
          <View className="bg-slate-100 border-b border-slate-200 flex-row">
            <SortHeader label="Nombre" k="nombre_curso" flex={1} />
            <SortHeader label="Precio" k="costo_curso" flex={0.3} />
            <SortHeader label="Acciones" k="Acciones" flex={0.2} center />
          </View>

          {filtered.length > 0 ? (
            filtered.map((r, id_curso) => (
              <Pressable
                key={r.id_curso}
                className={`flex-row items-center ${id_curso % 2 ? "bg-white" : "bg-slate-50"}`}
                android_ripple={{ color: "rgba(0,0,0,0.04)" }}
              >
                <View style={{ flex: 1 }} className="py-3 px-3">
                  <Text
                    numberOfLines={1}
                    className="text-slate-800 font-medium"
                  >
                    {r.nombre_curso}
                  </Text>
                </View>
                <View style={{ flex: 0.3 }} className="py-3 px-3">
                  <Text numberOfLines={1} className="text-slate-700">
                    {currencyFormatter.format(r.costo_curso || 0)}
                  </Text>
                </View>
                <View
                  id="celda-acciones"
                  style={{ flex: 0.2 }}
                  className="py-3 px-3"
                >
                  <View className="flex flex-row items-center justify-around">
                    <TouchableOpacity onPress={() => onEdit(r)}>
                      <Svg
                        height="22"
                        viewBox="0 -960 960 960"
                        width="22"
                        fill="#3b82f6"
                      >
                        <Path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 23 56.5T849-602l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
                      </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(r.id_curso)}>
                      <Svg
                        height="22"
                        viewBox="0 -960 960 960"
                        width="22"
                        fill="#ef4444"
                      >
                        <Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <View className="p-8 items-center justify-center bg-white">
              <Text className="text-slate-500 text-center font-medium">
                {query
                  ? "No se encontraron cursos para tu búsqueda."
                  : "Aún no hay cursos registrados."}
              </Text>
              <Text className="text-slate-400 text-center text-sm mt-1">
                {query
                  ? "Intenta con otras palabras clave."
                  : "¡Agrega un nuevo curso para comenzar!"}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
      {isRefetching && (
        <View
          style={StyleSheet.absoluteFill}
          className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl"
        >
          <ActivityIndicator size="large" color="#6F09EA" />
        </View>
      )}
      {loading && (
        <View
          style={StyleSheet.absoluteFill}
          className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl"
        >
          <ActivityIndicator size="large" color="#6F09EA" />
        </View>
      )}
    </View>
  );
};

const CurrencyInput = ({ value, onChangeText, placeholder, editable }) => {
  const isEditable = editable !== false;
  const inputRef = React.useRef(null);

  const handleFocus = () => {
    if (isEditable && (value === null || value === "")) {
      onChangeText("");
    }
    setTimeout(() => inputRef.current?.setSelection(99, 99), 0);
  };

  return (
    <View
      style={[
        styles.currencyInputContainer,
        !isEditable && styles.disabledInput,
      ]}
    >
      <Text style={styles.currencySymbol}>$</Text>
      <TextInput
        style={[
          styles.currencyInput,
          (value === "0" || value === "" || value === null) &&
            styles.currencyInputPlaceholder,
        ]}
        ref={inputRef}
        value={value === null ? "" : String(Math.floor(value))}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        placeholder={placeholder || "0"}
        keyboardType="number-pad"
        editable={isEditable}
      />
      <Text style={styles.currencyCents}>.00</Text>
    </View>
  );
};

const StepButton = ({ onPress, disabled, type, onPressIn, onPressOut }) => {
  const isIncrement = type === "increment";
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={[
        styles.stepButton,
        disabled && styles.stepButtonDisabled,
        isIncrement ? { marginLeft: 8 } : { marginRight: 8 },
      ]}
    >
      <Text
        style={[
          styles.stepButtonText,
          disabled && styles.stepButtonTextDisabled,
        ]}
      >
        {isIncrement ? "+" : "-"}
      </Text>
    </TouchableOpacity>
  );
};

const ChipButton = ({ label, onPress, disabled, variant, isSelected }) => (
  <TouchableOpacity
    style={[
      styles.chip,
      isSelected && styles.chipSelected,
      variant === "primary" && styles.chipPrimary,
      variant === "clear" && styles.chipClear,
      disabled && styles.chipDisabled,
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text
      style={[
        styles.chipText,
        isSelected && styles.chipTextSelected,
        variant === "primary" && styles.chipTextPrimary,
        variant === "clear" && styles.chipTextClear,
        disabled && styles.chipTextDisabled,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const ChipButtonGroup = ({
  chips,
  onSelect,
  disabled,
  selectedValue,
  clearLabel,
}) => (
  <View style={styles.chipContainer}>
    {selectedValue !== null && selectedValue !== 0 && (
      <ChipButton
        label={clearLabel || "Limpiar"}
        onPress={() => onSelect(0)}
        disabled={disabled}
        variant="clear"
      />
    )}
    {chips.map((chip) => (
      <ChipButton
        key={chip.value}
        label={chip.label}
        onPress={() => {
          if (chip.value === selectedValue) {
            onSelect(0);
          } else {
            onSelect(chip.value);
          }
        }}
        isSelected={chip.value === selectedValue && chip.value !== 0}
        variant={chip.variant}
        disabled={disabled || chip.disabled}
      />
    ))}
  </View>
);

const AddCursoForm = ({
  visible,
  onClose,
  onSave,
  isSaving,
  newCurso,
  setNewCurso,
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);
  const [liveCosto, setLiveCosto] = useState(Number(newCurso.costo_curso) || 0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  useEffect(() => {
    setLiveCosto(Number(newCurso.costo_curso) || 0);
  }, [newCurso.costo_curso]);

  const stopCounter = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleCostoChange = (value) => {
    setLiveCosto(value);
    setNewCurso((c) => ({ ...c, costo_curso: String(value) }));
  };

  const formStyle = {
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  if (!visible && anim._value === 0) {
    return null;
  }

  return (
    <Animated.View
      style={formStyle}
      className="bg-white p-4 m-2 -mt-2 rounded-xl border-t-0 border border-slate-200 shadow-sm"
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-slate-800">
          Agregar Nuevo Curso
        </Text>
        <TouchableOpacity onPress={onClose} hitSlop={10}>
          <Svg height="24" viewBox="0 -960 960 960" width="24" fill="#64748b">
            <Path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </Svg>
        </TouchableOpacity>
      </View>
      <View className="mb-2">
        <Text style={styles.label}>Nombre del Curso</Text>
        <TextInput
          className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white"
          value={newCurso.nombre_curso}
          onChangeText={(text) =>
            setNewCurso((c) => ({ ...c, nombre_curso: text }))
          }
          placeholder="Ej. Curso de Verano STEAM"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <Text style={styles.label}>Precio del Curso</Text>
      <View className="flex-row items-center">
        <StepButton
          type="decrement"
          disabled={(Number(newCurso.costo_curso) || 0) <= 0}
          onPress={() => handleCostoChange(Math.max(0, (liveCosto || 0) - 50))}
          onPressIn={() => {
            stopCounter();
            intervalRef.current = setInterval(() => {
              setLiveCosto((prev) => {
                const newValue = Math.max(0, (prev || 0) - 50);
                handleCostoChange(newValue);
                return newValue;
              });
            }, 150);
          }}
          onPressOut={stopCounter}
        />
        <View style={{ flex: 1 }}>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={5000}
            step={50}
            value={liveCosto}
            onSlidingComplete={handleCostoChange}
            minimumTrackTintColor={"#6F09EA"}
            maximumTrackTintColor="#d1d5db"
            thumbTintColor={"#6F09EA"}
          />
        </View>
        <CurrencyInput
          value={newCurso.costo_curso}
          onChangeText={(text) => {
            const numericValue =
              text === "" ? 0 : parseInt(text.replace(/[^0-9]/g, ""), 10) || 0;
            handleCostoChange(numericValue);
          }}
        />
        <StepButton
          type="increment"
          onPress={() => handleCostoChange((liveCosto || 0) + 50)}
          onPressIn={() => {
            stopCounter();
            intervalRef.current = setInterval(() => {
              setLiveCosto((prev) => {
                const newValue = (prev || 0) + 50;
                handleCostoChange(newValue);
                return newValue;
              });
            }, 150);
          }}
          onPressOut={stopCounter}
        />
      </View>
      <ChipButtonGroup
        chips={[500, 1000, 1500, 2000, 3000].map((v) => ({
          label: `$${v}`,
          value: v,
        }))}
        selectedValue={Number(newCurso.costo_curso)}
        onSelect={handleCostoChange}
      />
      <TouchableOpacity
        onPress={onSave}
        disabled={isSaving}
        className={`mt-4 px-5 py-3 rounded-lg self-end ${isSaving ? "bg-indigo-400" : "bg-indigo-600 shadow-md shadow-indigo-600/30"}`}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold">Guardar Curso</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const ScreenCursos = () => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Estados para el modal de edición ---
  const [isSaving, setIsSaving] = useState(false);

  // --- Estados para el modal de AGREGAR ---
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newCurso, setNewCurso] = useState({
    nombre_curso: "",
    costo_curso: "",
  });

  const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  // Función para convertir el string formateado de vuelta a un número
  const unformatCurrency = (formattedValue) =>
    parseFloat(String(formattedValue).replace(/[^0-9.-]+/g, "")) || 0;

  // Estado para guardar los datos originales al editar
  const [originalCursoData, setOriginalCursoData] = useState("");

  const handleCancelAdd = () => {
    let hasChanges = false;

    if (originalCursoData) {
      // Modo Edición: Comparamos el estado actual con el original.
      // Normalizamos los valores para una comparación más precisa.
      const currentNombre = newCurso.nombre_curso.trim();
      const originalNombre = originalCursoData.nombre_curso.trim();

      // Comparamos los costos como números para evitar problemas de tipo (string vs number)
      const currentCosto = Number(newCurso.costo_curso) || 0;
      const originalCosto = Number(originalCursoData.costo_curso) || 0;

      hasChanges =
        currentNombre !== originalNombre || currentCosto !== originalCosto;
    } else {
      // Modo Agregar: Comprobamos si se ha introducido algún dato.
      hasChanges =
        newCurso.nombre_curso.trim() !== "" ||
        newCurso.costo_curso.trim() !== "";
    }

    if (hasChanges) {
      Alert.alert(
        "¿Descartar curso?",
        "Si cancelas, los datos que ingresaste se perderán. ¿Estás seguro?",
        [
          { text: "Continuar editando", style: "cancel" },
          {
            text: "Sí, descartar",
            style: "destructive",
            onPress: () => setAddModalVisible(false), // Cierra el modal si el usuario confirma
          },
        ]
      );
    } else {
      // Si no hay cambios, simplemente cierra el modal sin preguntar.
      setAddModalVisible(false);
    }
  };

  const handleOpenAddModal = () => {
    setOriginalCursoData(null); // No hay datos originales en modo agregar
    setNewCurso({ nombre_curso: "", costo_curso: "" }); // Resetea el formulario
    setAddModalVisible(true);
  };
  const handleOpenEditModal = (curso) => {
    // 1. Cargar los datos del curso a editar en el estado del formulario.
    //    Aseguramos que el costo sea un string para el input.
    setNewCurso({ ...curso, costo_curso: String(curso.costo_curso || "") });
    // Guardamos una copia de los datos originales para comparar después.
    setOriginalCursoData({
      ...curso,
      costo_curso: String(curso.costo_curso || ""),
    });
    // 2. Abrir el mismo formulario que se usa para agregar.
    setAddModalVisible(true);
  };

  const handleRefresh = async () => {
    // Si ya está cargando, no hacemos nada
    if (isRefetching || loading) return;

    setIsRefetching(true);
    let { data, error } = await supabase.from("cursos").select("*");
    if (!error && data) {
      setCursos(data);
    }
    // Pequeño delay para que la animación del ícono sea perceptible
    setTimeout(() => setIsRefetching(false), 300);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchCursos = async () => {
        // Usamos isRefetching para la carga en foco, y loading para la carga inicial
        if (cursos.length > 0) {
          setIsRefetching(true);
        } else {
          setLoading(true);
        }

        const { data, error } = await supabase.from("cursos").select("*");
        if (!error && data) {
          setCursos(data);
        }
        setIsRefetching(false);
        setLoading(false);
      };
      fetchCursos();
    }, []) // El array vacío asegura que la función de fetch no se recree en cada render
  );

  const handleDelete = (id_curso) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("cursos")
              .delete()
              .eq("id_curso", id_curso);
            if (error) {
              Alert.alert("Error", "No se pudo eliminar el curso.");
              console.error("Error deleting course:", error);
            } else {
              // En lugar de solo actualizar el estado local, recargamos los datos.
              handleRefresh();
            }
          },
        },
      ]
    );
  };

  const handleAddCurso = async () => {
    if (!newCurso.nombre_curso || !newCurso.costo_curso) {
      Alert.alert(
        "Campos incompletos",
        "Por favor, completa el nombre y el precio del curso."
      );
      return;
    }
    setIsSaving(true);

    const payload = {
      nombre_curso: newCurso.nombre_curso,
      costo_curso: unformatCurrency(newCurso.costo_curso),
    };

    let result;
    // Si el curso tiene un ID, es una actualización (UPDATE).
    if (newCurso.id_curso) {
      result = await supabase
        .from("cursos")
        .update(payload)
        .eq("id_curso", newCurso.id_curso);
    } else {
      // Si no tiene ID, es una inserción (INSERT).
      // Dejamos que Supabase genere el ID.
      result = await supabase.from("cursos").insert(payload);
    }

    const { error } = result;
    setIsSaving(false);

    if (error) {
      const action = newCurso.id_curso ? "actualizar" : "crear";
      Alert.alert("Error", `No se pudo ${action} el curso.`);
      console.error(`Error al ${action} el curso:`, error);
    } else {
      handleRefresh(); // Recargamos la lista para ver los cambios.
      setAddModalVisible(false);
      setNewCurso({ nombre_curso: "", costo_curso: "" });
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS === "web" ? "" : Keyboard.dismiss}
      accessible={false}
    >
      <KeyboardAvoidingView
        key={isLandscape ? "landscape" : "portrait"} // Clave para forzar el reseteo en cambio de orientación
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View className="flex-1 bg-slate-50">
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center bg-white border border-slate-300 rounded-full px-3 py-1 shadow-sm">
              <Svg
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="#9ca3af"
              >
                <Path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </Svg>
              <TextInput
                placeholder="Buscar por nombre o precio"
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="ml-2 text-base"
              />
            </View>
            <View className="flex-row">
              <TouchableOpacity
                onPress={handleOpenAddModal}
                className="bg-indigo-600 p-2 rounded-full shadow-md shadow-indigo-600/30 flex-row items-center px-4"
              >
                <Svg
                  height="18"
                  viewBox="0 -960 960 960"
                  width="18"
                  fill="#ffffff"
                >
                  <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </Svg>
                <Text className="text-white font-bold ml-2">Agregar Curso</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TablaCursos
            data={cursos}
            loading={loading}
            query={searchTerm}
            isRefetching={isRefetching}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
          />
          {isAddModalVisible && (
            <AddCursoForm
              visible={isAddModalVisible}
              onClose={handleCancelAdd}
              onSave={handleAddCurso}
              isSaving={isSaving}
              newCurso={newCurso}
              setNewCurso={setNewCurso}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const SeccionVentas = ({ onFormToggle, navigation }) => {
  const [estudiantesConAdeudo, setEstudiantesConAdeudo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Estados para la animación del formulario ---
  const [isFormVisible, setIsFormVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  // Estados para el modal de pago
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [coursePaymentModalVisible, setCoursePaymentModalVisible] =
    useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState(null);
  const [selectedCourseForPayment, setSelectedCourseForPayment] =
    useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Estado para el filtro de año
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  const handleGenerateSale = () => {
    setIsFormVisible(true);
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const handleCloseForm = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 200, // Duración corta para una salida rápida
      useNativeDriver: true,
    }).start(() => {
      setIsFormVisible(false); // Oculta el componente después de la animación
      // Actualizar la tabla después de cerrar el formulario
      handleRefresh();
    });
  };

  const handleReprint = async (transaccion) => {
    try {
      console.log("Reimprimiendo ticket para transacción:", transaccion);

      // Verificar que tenemos el ID de la transacción
      if (!transaccion || !transaccion.id_transaccion) {
        Alert.alert("Error", "No se pudo identificar la transacción.");
        return;
      }

      // Obtener los datos completos de la transacción con relaciones
      const { data, error } = await supabase
        .from("transacciones")
        .select(
          `
          *,
          alumnos!fk_transacciones_alumno (nombre_alumno, direccion_alumno, grupo),
          cursos (nombre_curso)
        `
        )
        .eq("id_transaccion", transaccion.id_transaccion)
        .single();

      if (error) {
        console.error("Error obteniendo transacción:", error);
        throw error;
      }

      if (!data) {
        Alert.alert("Error", "No se encontró la transacción.");
        return;
      }

      // Generar el folio con el formato MQ-YEAR-ID (con padding de 4 dígitos)
      // Parsear la fecha en zona horaria local
      const fechaParts = data.fecha_transaction.split("T")[0].split("-");
      const year = parseInt(fechaParts[0], 10);
      const paddedId = String(data.id_transaccion).padStart(4, "0");
      const folio = `MQ-${year}-${paddedId}`;

      const currencyFormatter = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      });

      // Usar la fecha y hora actual de la reimpresión
      const today = new Date();

      // Generar descripción automática si no hay referencia
      let descripcion = data.referencia;
      if (!descripcion || descripcion.trim() === "") {
        // Formatear la fecha de la transacción original
        const [yearTx, monthTx, dayTx] = data.fecha_transaction
          .split("T")[0]
          .split("-");
        const fechaTransaccion = new Date(
          parseInt(yearTx, 10),
          parseInt(monthTx, 10) - 1,
          parseInt(dayTx, 10)
        );
        const fechaFormateada = `${String(fechaTransaccion.getDate()).padStart(2, "0")}/${String(fechaTransaccion.getMonth() + 1).padStart(2, "0")}/${fechaTransaccion.getFullYear()}`;

        descripcion = `Compra del curso "${data.cursos?.nombre_curso || "No especificado"}", del día ${fechaFormateada} por ${data.alumnos?.nombre_alumno || "No especificado"}`;
      }

      // Generar el HTML del ticket directamente
      const html = `
  <html>
    <head>
    <style></style>
    </head>
    <body style="width:181px; background-color: #ffffff; font-family: monospace; font-size: 0.75rem; line-height: 1rem; color: #000000;">
      <div style="display: flex; height: 2rem; justify-content: center; position: relative;">
        <h1 style="position: absolute; top: -0.6rem; letter-spacing: .025em; font-family: sans-serif; font-weight: 700; font-size: 12px; z-index: 1;">
          MQerK
        </h1>
        <h2 style="position: absolute; bottom: 0rem; left: 4.375rem; letter-spacing: .3em; font-family: sans-serif; font-size: 10px; font-weight: 300; z-index: 1;">
          Academy
        </h2>
        <div style="position: absolute; top: 0rem; right: 3.75rem; border-radius: 9999px; padding: 0.2rem; border-width: 1px; border-style: solid; border-color: #000000;"></div>
        <p style="font-size: 0.01rem; position: absolute; top: -0.2rem; right: 3.85rem; font-weight: 700;">
          R
        </p>
      </div>
      <header>
        <p style="margin: -1px 0px -1px 0px;">Asesores Especializados en la enseñanza de la Ciencia y Tecnología</p>
        <p style="margin: -1px 0px -1px 0px;">C. Benito Juárez #25 Col. Centro</p>
        <p style="margin: -1px 0px -1px 0px;">Tuxtepec, Oaxaca</p>
        <p style="margin: -1px 0px -1px 0px;">C.P. 68300</p>
        <p style="margin: -1px 0px -1px 0px;">Tel. 287-181-1231</p>
        <p style="margin: -1px 0px -1px 0px;">RFC: GORK980908K61</p>
        <p style="margin: -1px 0px -1px 0px;">${today.toLocaleString("es-MX")}</p>
        <p style="margin: -1px 0px -1px 0px;">Folio: ${folio}</p>
        <h4 style="font-size: 0.875rem; margin: -1px 0px -18px 0px; line-height: 1.25rem;">Comprobante de Venta (Reimpresión)</h4>
      </header>

      <article style="margin-bottom: -1rem;">
        <h5 style="font-size: 0.75rem; line-height: 1rem; font-weight: 700; border-bottom: 1px solid #000;">
          Cliente
        </h5>
        <p style="margin: -15px 0px 0px 0px;">${data.alumnos?.nombre_alumno || "No especificado"}</p>
        <p style="margin: 0px 0px 0px 0px;">${data.alumnos?.direccion_alumno || "No especificado"}</p>
        <p style="margin: 0px 0px 0px 0px;">${data.grupo_alumno || data.alumnos?.grupo || "No especificado"}</p>
        <p style="margin: 0px 0px 0px 0px;">${descripcion}</p>
      </article>

      <div style="margin-bottom: -1rem;">
        <h5 style="font-size: 0.75rem; line-height: 1rem; font-weight: 700; border-bottom: 1px solid #000; padding-bottom: 0.25rem; margin-bottom: 0.25rem;">
          Detalles
        </h5>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: -0.75rem 0 0 0">
          ${
            data.cursos?.nombre_curso
              ? `
              <p style="flex-shrink: 1; margin-right: 0.5rem;">
                1x ${data.cursos.nombre_curso}
              </p>
              <p>${currencyFormatter.format(data.monto || 0)}</p>
            `
              : `
              <p>Curso(s) no especificado(s)</p>
              <p>${currencyFormatter.format(0)}</p>
            `
          }
        </div>
      </div>

      ${
        (data.incentivo_premium || 0) > 0
          ? `
        <div style="margin: 0 0 -0.75rem 0; display: flex; justify-content: space-between; align-items: center;">
          <p>Incentivo Premium:</p>
          <p style="white-space: nowrap;">- ${currencyFormatter.format(data.incentivo_premium)}</p>
        </div>
      `
          : ""
      }

      <div style="border-top: 1px dashed #000;"></div>

      <div style="margin: -0.75rem 0;display: flex; justify-content: space-between; align-items: center;">
        <p>Anticipo:</p>
        <p>- ${currencyFormatter.format(data.anticipo || 0)}</p>
      </div>

      <div style="border-top: 1px dashed #000;"></div>

      ${
        (data.anticipo || 0) > 0 && data.cursos?.nombre_curso
          ? `
        <div style="display: flex; margin: -0.75rem 0; justify-content: space-between; align-items: center;">
          <p style="font-weight: 700;">Pendiente:</p>
          <p style="font-size: 1rem; line-height: 1.5rem; font-weight: 700;">
            ${currencyFormatter.format((data.pendiente || 0) < 0 ? 0 : data.pendiente || 0)}
          </p>
        </div>
      `
          : ""
      }

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.2rem;">
        <p style="font-weight: 600;">Total a Pagar:</p>
        <p style="font-weight: 600; font-size: 1rem; line-height: 1.5rem;">
          ${currencyFormatter.format(data.total || 0)}
        </p>
      </div>
      <div style="border-top: 1px solid; border-bottom: 1px solid;">
        <p>Forma de pago: Efectivo</p>
      </div>
      <p style="font-weight: 700; text-align:center; margin: -0.05rem 0;">*CONSERVE ESTE COMPROBANTE*</p>
      <p style="margin: -0.05rem 0;">PAGO REALIZADO CON EXITO</p>
      <p style="margin: -0.05rem 0;">NO HAY DEVOLUCION DEL PAGO POR CUALQUIER SERVICIO PRESTADO EN NUESTRA INSTITUCIÓN</p>
      <p style="margin: -0.05rem 0;">Dudas o quejas al:</p>
      <p style="margin: -0.05rem 0;">287-181-1231</p>
      <p style="margin: -0.05rem 0;">¡GRACIAS POR LA CONFIANZA!</p>
      <p style="margin: -0.05rem 0;">Direccion: Lic. Kelvin Valentin Gómez Ramírez</p>
    </div>
    </body>
    </html>
  `;

      // Generar el PDF
      const { uri } = await Print.printToFileAsync({
        html: html,
        width: 200,
      });

      // Renombrar el archivo con un nombre descriptivo
      const ticketFileName = `Ticket-MQerKAcademy-${folio || "SN"}.pdf`;
      const newUri = `${FileSystem.cacheDirectory}${ticketFileName}`;
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      console.log("Ticket PDF generado en:", newUri);
      await shareAsync(newUri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
        dialogTitle: ticketFileName,
      });
    } catch (error) {
      console.error("Error al reimprimir ticket:", error);
      Alert.alert("Error", "No se pudo reimprimir el ticket: " + error.message);
    }
  };

  useEffect(() => {
    // Informa al componente padre si el formulario está visible para deshabilitar el swipe
    onFormToggle(isFormVisible);
  }, [isFormVisible, onFormToggle]);

  // Estilos de animación que se aplicarán al contenedor del formulario
  const formContainerStyle = {
    // El formulario se escala desde 0.95 a 1 (zoom in)
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
    // El formulario se desvanece de 0 a 1
    opacity: anim,
  };

  const fetchEstudiantesConAdeudo = async () => {
    // Consultamos la tabla 'transacciones' en lugar de 'alumnos'
    // Filtramos por pendiente > 0 para obtener solo las deudas
    const { data, error } = await supabase
      .from("transacciones")
      .select(
        `
        *,
        alumnos!fk_transacciones_alumno (id_alumno, nombre_alumno, grupo, direccion_alumno, estatus_alumno),
        cursos (nombre_curso, costo_curso)
      `
      )
      .gt("pendiente", 0) // Solo transacciones con deuda
      .order("fecha_transaction", { ascending: false }); // Ordenar por fecha más reciente

    if (!error && data) {
      const formattedData = data.map((t) => {
        // Mapeamos los datos de la transacción al formato que espera la tabla
        // Usamos los datos del alumno relacionado
        const alumno = t.alumnos || {};
        const curso = t.cursos || {};

        return {
          // Datos de la transacción como base
          id_transaccion: t.id_transaccion,
          fecha_transaction: t.fecha_transaction,
          monto_pendiente: t.pendiente,
          total: t.total,
          anticipo: t.anticipo,

          // Datos del alumno (aplanados)
          id_alumno: alumno.id_alumno, // Importante para las acciones (editar, etc.)
          nombre_alumno: alumno.nombre_alumno || "Desconocido",
          grupo: t.grupo_alumno || alumno.grupo || "Sin grupo", // Priorizamos el grupo de la transacción
          direccion_alumno: alumno.direccion_alumno,
          estatus_alumno: alumno.estatus_alumno,

          // Datos del curso
          nombre_curso: curso.nombre_curso || "Sin curso",
          costo_curso: curso.costo_curso,
        };
      });

      // Extraer años únicos de todas las transacciones
      const years = [
        ...new Set(
          formattedData
            .map((t) => {
              if (t.fecha_transaction) {
                return new Date(t.fecha_transaction).getFullYear();
              }
              return null;
            })
            .filter((y) => y !== null)
        ),
      ].sort((a, b) => b - a);

      setAvailableYears(years);
      setEstudiantesConAdeudo(formattedData);
    } else if (error) {
      console.error("Error fetching deudas:", error);
    }
    setLoading(false);
    setIsRefetching(false);
  };

  const handleRefresh = async () => {
    if (isRefetching || loading) return;
    setIsRefetching(true);
    await fetchEstudiantesConAdeudo();
  };

  useFocusEffect(
    useCallback(() => {
      if (estudiantesConAdeudo.length > 0) setIsRefetching(true);
      else setLoading(true);
      fetchEstudiantesConAdeudo();
    }, [])
  );

  const handleOpenPaymentModal = async (deuda) => {
    setSelectedDebtForPayment(deuda);
    setPaymentModalVisible(true);
    setProcessingPayment(true); // Usamos esto como loading

    try {
      // Obtener todas las transacciones del estudiante
      const { data, error } = await supabase
        .from("transacciones")
        .select(
          `
          pendiente,
          total,
          anticipo,
          curso_id,
          id_transaccion,
          fecha_transaction,
          cursos (nombre_curso)
        `
        )
        .eq("alumno_id", deuda.id_alumno);

      if (error) throw error;

      let deudaTotal = 0;
      let pagadoTotal = 0;
      const cursosMap = new Map();

      data.forEach((t) => {
        deudaTotal += t.pendiente || 0;
        pagadoTotal +=
          (t.anticipo || 0) +
          ((t.total || 0) - (t.pendiente || 0) - (t.anticipo || 0));

        if (t.curso_id && t.cursos) {
          if (!cursosMap.has(t.curso_id)) {
            cursosMap.set(t.curso_id, {
              id: t.curso_id,
              nombre: t.cursos.nombre_curso,
              pendiente: 0,
              transacciones: [],
              fecha_transaction: t.fecha_transaction, // Guardar la primera fecha
            });
          }
          const curso = cursosMap.get(t.curso_id);
          curso.pendiente += t.pendiente || 0;
          curso.transacciones.push(t);

          // Actualizar con la fecha más reciente
          if (
            t.fecha_transaction &&
            (!curso.fecha_transaction ||
              new Date(t.fecha_transaction) > new Date(curso.fecha_transaction))
          ) {
            curso.fecha_transaction = t.fecha_transaction;
          }
        }
      });

      setStudentDetails({
        deudaTotal,
        pagadoTotal,
        cursos: Array.from(cursosMap.values()),
      });
    } catch (err) {
      console.error("Error fetching student details:", err);
      Alert.alert(
        "Error",
        "No se pudieron cargar los detalles del estudiante."
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleOpenCoursePaymentModal = (curso) => {
    setSelectedCourseForPayment(curso);
    setPaymentAmount(0);
    setCoursePaymentModalVisible(true);
  };

  const handleProcessPayment = async () => {
    const amount = Number(paymentAmount);
    if (amount <= 0) {
      Alert.alert("Error", "Por favor selecciona un monto válido.");
      return;
    }

    if (amount > selectedCourseForPayment.pendiente) {
      Alert.alert(
        "Error",
        "El monto del abono no puede ser mayor al saldo pendiente."
      );
      return;
    }

    setProcessingPayment(true);

    try {
      // Buscar las transacciones pendientes para este curso
      const transactions = selectedCourseForPayment.transacciones
        .filter((t) => t.pendiente > 0)
        .sort((a, b) => a.id_transaccion - b.id_transaccion);

      let remainingPayment = amount;

      for (const transaction of transactions) {
        if (remainingPayment <= 0) break;

        const paymentForThisTransaction = Math.min(
          remainingPayment,
          transaction.pendiente
        );
        const newPendiente = transaction.pendiente - paymentForThisTransaction;

        const { error: updateError } = await supabase
          .from("transacciones")
          .update({ pendiente: newPendiente })
          .eq("id_transaccion", transaction.id_transaccion);

        if (updateError) throw updateError;

        remainingPayment -= paymentForThisTransaction;
      }

      // Registrar el abono en la tabla de ingresos
      const { error: ingresoError } = await supabase.from("ingresos").insert([
        {
          fecha_ingreso: new Date().toISOString().split("T")[0],
          monto_ingreso: amount,
          nombre_ingreso: selectedCourseForPayment.nombre,
          desc_ingreso: selectedDebtForPayment?.nombre_alumno,
        },
      ]);

      if (ingresoError) throw ingresoError;

      Alert.alert("Éxito", "Abono registrado correctamente.");
      setCoursePaymentModalVisible(false);
      // Recargar detalles del estudiante
      handleOpenPaymentModal(selectedDebtForPayment);
      // Recargar lista
      handleRefresh();
    } catch (error) {
      console.error("Error processing payment:", error);
      Alert.alert("Error", "Hubo un problema al procesar el abono.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const SortHeader = ({ label, k, flex = 1, center }) => (
    <Pressable
      onPress={() => {
        if (!k) return;
        setSortKey(k);
        setSortDir((d) =>
          sortKey === k ? (d === "asc" ? "desc" : "asc") : "asc"
        );
      }}
      className="py-3 px-3"
      style={{ flex, alignItems: center ? "center" : "flex-start" }}
      android_ripple={{ color: "rgba(0,0,0,0.05)" }}
    >
      <View className="flex-row items-center gap-1">
        <Text className="text-slate-800 font-semibold text-xs sm:text-sm uppercase tracking-wide">
          {label}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS !== "web" ? Keyboard.dismiss : ""}
    >
      <View className="flex-1 bg-slate-50 relative">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#6F09EA" />
          </View>
        ) : (
          <>
            {/* Primera fila: Búsqueda */}
            <View className="px-4 pt-4">
              <View className="flex-row items-center bg-white border border-slate-300 rounded-full px-3 py-1 shadow-sm">
                <Svg
                  height="20"
                  viewBox="0 -960 960 960"
                  width="20"
                  fill="#9ca3af"
                >
                  <Path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </Svg>
                <TextInput
                  editable={!isFormVisible}
                  placeholder="Buscar por nombre, curso..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  className="ml-2 text-base flex-1"
                />
              </View>
            </View>

            {/* Segunda fila: Filtro de año y botón */}
            <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
              {/* Selector de Año */}
              <View className="bg-white border border-slate-300 rounded-full px-3 py-1 shadow-sm flex-row items-center flex-1 mr-2">
                <Svg
                  height="18"
                  viewBox="0 -960 960 960"
                  width="18"
                  fill="#6b7280"
                >
                  <Path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
                </Svg>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="ml-2"
                >
                  <View className="flex-row gap-2">
                    {/* Opción "Todos" */}
                    <TouchableOpacity
                      onPress={() => setSelectedYear(null)}
                      className={`px-3 py-1 rounded-full ${
                        selectedYear === null ? "bg-purple-600" : "bg-slate-100"
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          selectedYear === null
                            ? "text-white"
                            : "text-slate-600"
                        }`}
                      >
                        Todos
                      </Text>
                    </TouchableOpacity>
                    {availableYears.map((year) => (
                      <TouchableOpacity
                        key={year}
                        onPress={() => setSelectedYear(year)}
                        className={`px-3 py-1 rounded-full ${
                          selectedYear === year
                            ? "bg-indigo-600"
                            : "bg-slate-100"
                        }`}
                      >
                        <Text
                          className={`text-sm font-semibold ${
                            selectedYear === year
                              ? "text-white"
                              : "text-slate-600"
                          }`}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Botón Generar Venta */}
              <TouchableOpacity
                onPress={handleGenerateSale}
                className="bg-teal-600 p-2 rounded-full shadow-md shadow-teal-600/30 flex-row items-center px-4"
              >
                <Svg
                  height="18"
                  viewBox="0 -960 960 960"
                  width="18"
                  fill="#ffffff"
                >
                  <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </Svg>
                <Text className="text-white font-bold ml-2">Generar Venta</Text>
              </TouchableOpacity>
            </View>

            <TablaVentasPendientes
              data={estudiantesConAdeudo}
              query={searchTerm}
              isRefetching={isRefetching}
              onRefresh={handleRefresh}
              onReprint={handleReprint}
              onRowClick={handleOpenPaymentModal}
              selectedYear={selectedYear}
            />
          </>
        )}

        {/* El formulario ahora se renderiza sobre la lista y se anima */}
        {isFormVisible && (
          <Animated.View
            style={[StyleSheet.absoluteFill, formContainerStyle]}
            className="absolute inset-0 z-10"
          >
            <RegistroVenta
              navigation={navigation}
              onFormClose={handleCloseForm}
            />
          </Animated.View>
        )}

        {/* Modal de detalles del estudiante - Usando el mismo componente que en Estudiantes */}
        <StudentDetailsModal
          visible={paymentModalVisible}
          onClose={() => setPaymentModalVisible(false)}
          student={{
            nombre_estudiante: selectedDebtForPayment?.nombre_alumno,
            grupo: selectedDebtForPayment?.grupo,
          }}
          details={studentDetails}
          loading={processingPayment}
          onMakePayment={handleOpenCoursePaymentModal}
        />

        {/* Modal de abono a curso específico */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={coursePaymentModalVisible}
          onRequestClose={() => setCoursePaymentModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50 px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <Text className="text-xl font-bold text-slate-800 mb-2">
                Registrar Abono
              </Text>
              <Text className="text-slate-600 mb-2">
                Estudiante: {selectedDebtForPayment?.nombre_alumno}
              </Text>
              <Text className="text-slate-600 mb-4">
                Curso: {selectedCourseForPayment?.nombre}
              </Text>
              <Text className="text-slate-500 text-sm mb-2">
                Pendiente actual: $
                {selectedCourseForPayment?.pendiente.toLocaleString("es-MX")}
              </Text>

              <View className="items-center mb-6">
                <Text className="text-4xl font-bold text-indigo-600 mb-4">
                  ${Math.round(paymentAmount).toLocaleString("es-MX")}
                </Text>

                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={0}
                  maximumValue={selectedCourseForPayment?.pendiente || 0}
                  step={10}
                  value={Number(paymentAmount)}
                  onSlidingComplete={(val) => setPaymentAmount(val)}
                  minimumTrackTintColor="#4f46e5"
                  maximumTrackTintColor="#cbd5e1"
                  thumbTintColor="#4f46e5"
                />

                <View className="flex-row flex-wrap justify-center gap-2 mt-4">
                  {(() => {
                    const total = selectedCourseForPayment?.pendiente || 0;

                    const roundToNice = (num) => {
                      if (num <= 10) return Math.round(num / 5) * 5;
                      if (num <= 50) return Math.round(num / 10) * 10;
                      if (num <= 100) return Math.round(num / 20) * 20;
                      return Math.round(num / 50) * 50;
                    };

                    const amounts = [
                      roundToNice(total * 0.33),
                      roundToNice(total * 0.66),
                      total,
                    ].filter((val, idx, arr) => arr.indexOf(val) === idx);

                    return amounts.map((amount, idx) => {
                      const isTotal = amount === total;
                      return (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => setPaymentAmount(amount)}
                          className={`px-3 py-1 rounded-full border ${
                            paymentAmount === amount
                              ? "bg-indigo-100 border-indigo-500"
                              : "bg-white border-slate-300"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              paymentAmount === amount
                                ? "text-indigo-700"
                                : "text-slate-600"
                            }`}
                          >
                            {isTotal
                              ? "Total"
                              : `$${amount.toLocaleString("es-MX")}`}
                          </Text>
                        </TouchableOpacity>
                      );
                    });
                  })()}
                </View>
              </View>

              <View className="flex-row justify-end gap-3">
                <TouchableOpacity
                  onPress={() => setCoursePaymentModalVisible(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100"
                  disabled={processingPayment}
                >
                  <Text className="text-slate-600 font-semibold">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleProcessPayment}
                  className="px-4 py-2 rounded-lg bg-indigo-600"
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-white font-semibold">Confirmar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const SeccionReportes = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [ingresosData, setIngresosData] = useState([]);
  const [egresosData, setEgresosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);

  // Opciones de meses
  const monthOptions = useMemo(
    () => [
      { label: "Enero", value: 1 },
      { label: "Febrero", value: 2 },
      { label: "Marzo", value: 3 },
      { label: "Abril", value: 4 },
      { label: "Mayo", value: 5 },
      { label: "Junio", value: 6 },
      { label: "Julio", value: 7 },
      { label: "Agosto", value: 8 },
      { label: "Septiembre", value: 9 },
      { label: "Octubre", value: 10 },
      { label: "Noviembre", value: 11 },
      { label: "Diciembre", value: 12 },
    ],
    []
  );

  // Detectar orientación de la pantalla
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  // Memoizar currencyFormatter para evitar recrearlo en cada render
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }),
    []
  );

  // Función para cargar años disponibles desde Supabase (memoizada)
  const fetchAvailableYears = useCallback(async () => {
    setLoadingYears(true);
    try {
      // Obtener años de ingresos
      const { data: ingresos, error: ingresosError } = await supabase
        .from("ingresos")
        .select("fecha_ingreso");

      // Obtener años de egresos (solo pagados)
      const { data: egresos, error: egresosError } = await supabase
        .from("egresos")
        .select("fecha_egreso, estado")
        .eq("estado", "pagado");

      // Obtener años de transacciones (ventas)
      const { data: transacciones, error: transError } = await supabase
        .from("transacciones")
        .select("fecha_transaction");

      if (ingresosError || egresosError || transError) {
        console.error(
          "Error fetching years:",
          ingresosError || egresosError || transError
        );
        return;
      }

      // Extraer años únicos
      const yearsSet = new Set();

      ingresos?.forEach((item) => {
        if (item.fecha_ingreso) {
          const year = item.fecha_ingreso.split("-")[0];
          yearsSet.add(parseInt(year));
        }
      });

      egresos?.forEach((item) => {
        if (item.fecha_egreso) {
          const year = item.fecha_egreso.split("-")[0];
          yearsSet.add(parseInt(year));
        }
      });

      transacciones?.forEach((item) => {
        if (item.fecha_transaction) {
          const year = item.fecha_transaction.split("-")[0];
          yearsSet.add(parseInt(year));
        }
      });

      // Convertir a array y ordenar descendente
      const yearsArray = Array.from(yearsSet)
        .sort((a, b) => b - a)
        .map((year) => ({
          label: String(year),
          value: year,
        }));

      setAvailableYears(yearsArray);
    } catch (error) {
      console.error("Error fetching available years:", error);
    } finally {
      setLoadingYears(false);
    }
  }, []);

  const fetchData = useCallback(async (selectedYear) => {
    const startDate = `${selectedYear}-01-01`;
    const endDate = `${selectedYear}-12-31`;

    try {
      // 1. Fetch Transacciones (Ventas) - Solo el anticipo es ingreso real
      const { data: transacciones, error: transError } = await supabase
        .from("transacciones")
        .select("fecha_transaction, anticipo")
        .gte("fecha_transaction", startDate)
        .lte("fecha_transaction", endDate);

      if (transError)
        console.error("Error fetching transacciones:", transError);

      // 2. Fetch Ingresos (Otros ingresos)
      const { data: ingresos, error: ingresosError } = await supabase
        .from("ingresos")
        .select("fecha_ingreso, monto_ingreso")
        .gte("fecha_ingreso", startDate)
        .lte("fecha_ingreso", endDate);

      if (ingresosError)
        console.error("Error fetching ingresos:", ingresosError);

      // 3. Fetch Egresos (Solo pagados)
      const { data: egresos, error: egresosError } = await supabase
        .from("egresos")
        .select("fecha_egreso, monto_egreso")
        .eq("estado", "pagado")
        .gte("fecha_egreso", startDate)
        .lte("fecha_egreso", endDate);

      if (egresosError) console.error("Error fetching egresos:", egresosError);

      const monthsTemplate = Array.from({ length: 13 }, (_, i) => {
        const label = new Date(0, i).toLocaleString("es-MX", {
          month: "short",
        });

        return {
          value: 0,
          label: label,
          dataPointText: "0",
        };
      });

      const monthlyIngresos = JSON.parse(JSON.stringify(monthsTemplate));
      const monthlyEgresos = JSON.parse(JSON.stringify(monthsTemplate));

      // Helper to parse date - Extraer mes directamente del string
      const getMonthFromDate = (dateStr) => {
        if (!dateStr) return null;
        if (typeof dateStr === "string" && dateStr.includes("-")) {
          const datePart = dateStr.split("T")[0];
          const [year, month, day] = datePart.split("-").map(Number);
          return month;
        }
        return null;
      };

      // Process Transacciones (Add to Ingresos) - Sumar solo el anticipo
      transacciones?.forEach((item) => {
        const monthIndex = getMonthFromDate(item.fecha_transaction);
        if (monthIndex !== null) {
          monthlyIngresos[monthIndex].value += item.anticipo || 0;
        }
      });

      // Process Ingresos (Add to Ingresos)
      ingresos?.forEach((item) => {
        const monthIndex = getMonthFromDate(item.fecha_ingreso);
        if (monthIndex !== null) {
          monthlyIngresos[monthIndex].value += item.monto_ingreso || 0;
        }
      });

      // Process Egresos
      egresos?.forEach((item) => {
        const monthIndex = getMonthFromDate(item.fecha_egreso);
        if (monthIndex !== null) {
          monthlyEgresos[monthIndex].value += item.monto_egreso || 0;
        }
      });

      // Update dataPointText
      monthlyIngresos.forEach((item) => {
        if (item) {
          item.dataPointText =
            item.value > 0 ? item.value.toLocaleString("es-MX") : "";
        }
      });
      monthlyEgresos.forEach((item) => {
        if (item) {
          item.dataPointText =
            item.value > 0 ? item.value.toLocaleString("es-MX") : "";
        }
      });

      // Filter to show relevant range
      const filterDataByRange = (data, selectedYear) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const validData = data.filter((item) => item !== null);

        if (selectedYear === currentYear) {
          return validData.slice(1, currentMonth + 1);
        }

        return validData.slice(1, 13);
      };

      const filteredIngresos = filterDataByRange(monthlyIngresos, selectedYear);
      const filteredEgresos = filterDataByRange(monthlyEgresos, selectedYear);

      setIngresosData(filteredIngresos);
      setEgresosData(filteredEgresos);
    } catch (error) {
      console.error("Error in fetchData:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    await fetchData(year);
  }, [loading, year, fetchData]);

  // Solo useFocusEffect, no useEffect duplicado
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        await fetchAvailableYears();
        setLoading(true);
        await fetchData(year);
      };
      loadData();
    }, [year]) // Solo year como dependencia
  );

  const totalIngresos = useMemo(
    () => ingresosData.reduce((sum, item) => sum + item.value, 0),
    [ingresosData]
  );
  const totalEgresos = useMemo(
    () => egresosData.reduce((sum, item) => sum + item.value, 0),
    [egresosData]
  );

  // Calcular balance (Ingresos - Egresos)
  const balance = useMemo(
    () => totalIngresos - totalEgresos,
    [totalIngresos, totalEgresos]
  );

  // Calcular balance del mes actual
  const balanceMesActual = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12

    // Solo calcular si estamos viendo el año actual
    if (year !== currentYear) return null;

    // El último elemento del array es el mes actual
    const lastIndex = ingresosData.length - 1;
    if (lastIndex < 0) return 0;

    const ingresosMes = ingresosData[lastIndex]?.value || 0;
    const egresosMes = egresosData[lastIndex]?.value || 0;

    return ingresosMes - egresosMes;
  }, [ingresosData, egresosData, year]);

  // Calcular balance del mes seleccionado
  const balanceMesSeleccionado = useMemo(() => {
    const ingresosMes = ingresosData[selectedMonth - 1]?.value || 0;
    const egresosMes = egresosData[selectedMonth - 1]?.value || 0;
    return ingresosMes - egresosMes;
  }, [ingresosData, egresosData, selectedMonth]);

  // Calcular totales del mes seleccionado para mostrar en las gráficas
  const totalIngresosMesSeleccionado = useMemo(() => {
    return ingresosData[selectedMonth - 1]?.value || 0;
  }, [ingresosData, selectedMonth]);

  const totalEgresosMesSeleccionado = useMemo(() => {
    return egresosData[selectedMonth - 1]?.value || 0;
  }, [egresosData, selectedMonth]);

  // Verificar si estamos en el mes y año actual
  const isCurrentMonthAndYear = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    return year === currentYear && selectedMonth === currentMonth;
  }, [year, selectedMonth]);

  // Calcular totales del mes actual para mostrar en las gráficas
  const totalIngresosMesActual = useMemo(() => {
    const currentYear = new Date().getFullYear();
    if (year !== currentYear) return null;

    const lastIndex = ingresosData.length - 1;
    return lastIndex >= 0 ? ingresosData[lastIndex]?.value || 0 : 0;
  }, [ingresosData, year]);

  const totalEgresosMesActual = useMemo(() => {
    const currentYear = new Date().getFullYear();
    if (year !== currentYear) return null;

    const lastIndex = egresosData.length - 1;
    return lastIndex >= 0 ? egresosData[lastIndex]?.value || 0 : 0;
  }, [egresosData, year]);

  const ChartCard = React.memo(
    ({
      title,
      total,
      data,
      unit = "",
      isPortrait,
      loading,
      totalMesActual,
      monthName,
      isCurrentMonth,
    }) => (
      <View
        className={`bg-white p-4 items-center rounded-xl shadow-sm border border-slate-200 mb-4 overflow-hidden ${
          isPortrait ? "w-full" : "flex-1 min-w-[300px]"
        }`}
      >
        <View className="w-full mb-4">
          <View className="flex-row justify-between items-baseline">
            <Text className="text-lg font-bold text-slate-800">{title}</Text>
            <Text className="text-xl font-extrabold text-indigo-600">
              {totalMesActual !== null && totalMesActual !== undefined
                ? unit === "$"
                  ? currencyFormatter.format(totalMesActual)
                  : `${totalMesActual}`
                : unit === "$"
                  ? currencyFormatter.format(total)
                  : `${total} ${title.toLowerCase()}`}
            </Text>
          </View>
          {totalMesActual !== null &&
            totalMesActual !== undefined &&
            monthName && (
              <Text className="text-xs text-slate-500 mt-1">
                {monthName}
                {isCurrentMonth && " (Mes Actual)"}
              </Text>
            )}
        </View>
        {loading ? (
          <View className="h-60 justify-center items-center">
            <ActivityIndicator color="#6F09EA" />
          </View>
        ) : (
          <View style={{ marginLeft: isPortrait ? 45 : 43 }}>
            <LineChart
              data={data}
              spacing={isPortrait ? 55 : 43}
              thickness={3}
              hideRules
              hideYAxisText
              xAxisThickness={0}
              yAxisThickness={0}
              xAxisLabelTextStyle={{ color: "#9ca3af", fontSize: 10 }}
              noOfSections={4}
              color="#6F09EA"
              startFillColor="#a78bfa"
              endFillColor="#ffffff"
              startOpacity={0.4}
              endOpacity={0.1}
              areaChart
              dataPointsColor="#6F09EA"
              dataPointsRadius={4}
              textColor="#64748b"
              textFontSize={11}
              textShiftY={-10}
              textShiftX={-15}
              showValuesAsDataPointsText
            />
          </View>
        )}
      </View>
    )
  );

  // Función para generar PDF del reporte
  const generateReportPDF = async () => {
    try {
      // Siempre usar el año y mes actual para el reporte
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; // 1-12
      const currentMonthName = monthOptions.find(
        (m) => m.value === currentMonth
      )?.label;

      const currentDate = new Date().toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Obtener datos del año actual
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;

      // Fetch data para el año actual
      const { data: transacciones } = await supabase
        .from("transacciones")
        .select("fecha_transaction, anticipo")
        .gte("fecha_transaction", startDate)
        .lte("fecha_transaction", endDate);

      const { data: ingresos } = await supabase
        .from("ingresos")
        .select("fecha_ingreso, monto_ingreso")
        .gte("fecha_ingreso", startDate)
        .lte("fecha_ingreso", endDate);

      const { data: egresos } = await supabase
        .from("egresos")
        .select("fecha_egreso, monto_egreso, estado")
        .gte("fecha_egreso", startDate)
        .lte("fecha_egreso", endDate)
        .eq("estado", "pagado");

      // Procesar datos por mes
      const monthlyIngresos = Array.from({ length: 13 }, (_, i) => ({
        label: i === 0 ? "" : monthOptions[i - 1]?.label || "",
        value: 0,
      }));

      const monthlyEgresos = Array.from({ length: 13 }, (_, i) => ({
        label: i === 0 ? "" : monthOptions[i - 1]?.label || "",
        value: 0,
      }));

      // Procesar transacciones (anticipos)
      transacciones?.forEach((item) => {
        const month = parseInt(item.fecha_transaction.split("-")[1]);
        if (month >= 1 && month <= 12) {
          monthlyIngresos[month].value += item.anticipo || 0;
        }
      });

      // Procesar ingresos
      ingresos?.forEach((item) => {
        const month = parseInt(item.fecha_ingreso.split("-")[1]);
        if (month >= 1 && month <= 12) {
          monthlyIngresos[month].value += item.monto_ingreso || 0;
        }
      });

      // Procesar egresos
      egresos?.forEach((item) => {
        const month = parseInt(item.fecha_egreso.split("-")[1]);
        if (month >= 1 && month <= 12) {
          monthlyEgresos[month].value += item.monto_egreso || 0;
        }
      });

      // Calcular totales hasta el mes actual
      let totalIngresosAnual = 0;
      let totalEgresosAnual = 0;

      for (let i = 1; i <= currentMonth; i++) {
        totalIngresosAnual += monthlyIngresos[i].value;
        totalEgresosAnual += monthlyEgresos[i].value;
      }

      const balanceAnual = totalIngresosAnual - totalEgresosAnual;
      const ingresosMesActual = monthlyIngresos[currentMonth].value;
      const egresosMesActual = monthlyEgresos[currentMonth].value;
      const balanceMesActual = ingresosMesActual - egresosMesActual;

      // Generar tablas HTML solo hasta el mes actual
      const ingresosTable = monthlyIngresos
        .slice(1, currentMonth + 1)
        .map((item) => {
          return `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.label}</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">
                ${currencyFormatter.format(item.value)}
              </td>
            </tr>
          `;
        })
        .join("");

      const egresosTable = monthlyEgresos
        .slice(1, currentMonth + 1)
        .map((item) => {
          return `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.label}</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">
                ${currencyFormatter.format(item.value)}
              </td>
            </tr>
          `;
        })
        .join("");

      // Función para generar gráfica SVG
      const generateLineChartSVG = (data, color, label) => {
        const width = 700;
        const height = 250;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        const maxValue = Math.max(...data, 1);
        const stepX = chartWidth / (data.length - 1 || 1);

        // Generar puntos de la línea
        const points = data
          .map((value, index) => {
            const x = padding + index * stepX;
            const y = height - padding - (value / maxValue) * chartHeight;
            return `${x},${y}`;
          })
          .join(" ");

        // Generar path para el área rellena
        const areaPath = `
          M ${padding},${height - padding}
          L ${data
            .map((value, index) => {
              const x = padding + index * stepX;
              const y = height - padding - (value / maxValue) * chartHeight;
              return `${x},${y}`;
            })
            .join(" L ")}
          L ${padding + (data.length - 1) * stepX},${height - padding}
          Z
        `;

        return `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <!-- Fondo -->
            <rect width="${width}" height="${height}" fill="#ffffff"/>
            
            <!-- Grid horizontal -->
            ${[0, 0.25, 0.5, 0.75, 1]
              .map(
                (ratio) => `
              <line 
                x1="${padding}" 
                y1="${height - padding - chartHeight * ratio}" 
                x2="${width - padding}" 
                y2="${height - padding - chartHeight * ratio}" 
                stroke="#e2e8f0" 
                stroke-width="1"
              />
              <text 
                x="${padding - 10}" 
                y="${height - padding - chartHeight * ratio + 5}" 
                text-anchor="end" 
                font-size="10" 
                fill="#64748b"
              >
                $${Math.round(maxValue * ratio).toLocaleString()}
              </text>
            `
              )
              .join("")}
            
            <!-- Área rellena -->
            <path 
              d="${areaPath}" 
              fill="${color}" 
              fill-opacity="0.2"
            />
            
            <!-- Línea -->
            <polyline 
              points="${points}" 
              fill="none" 
              stroke="${color}" 
              stroke-width="3"
            />
            
            <!-- Puntos -->
            ${data
              .map((value, index) => {
                const x = padding + index * stepX;
                const y = height - padding - (value / maxValue) * chartHeight;
                return `
                <circle cx="${x}" cy="${y}" r="4" fill="${color}"/>
              `;
              })
              .join("")}
            
            <!-- Etiquetas del eje X -->
            ${monthlyIngresos
              .slice(1, currentMonth + 1)
              .map((item, index) => {
                const x = padding + index * stepX;
                return `
                <text 
                  x="${x}" 
                  y="${height - 10}" 
                  text-anchor="middle" 
                  font-size="10" 
                  fill="#64748b"
                >
                  ${item.label.substring(0, 3)}
                </text>
              `;
              })
              .join("")}
            
            <!-- Título -->
            <text 
              x="${width / 2}" 
              y="20" 
              text-anchor="middle" 
              font-size="14" 
              font-weight="bold" 
              fill="#1e293b"
            >
              ${label}
            </text>
          </svg>
        `;
      };

      // Generar SVGs de las gráficas
      const ingresosSVG = generateLineChartSVG(
        monthlyIngresos.slice(1, currentMonth + 1).map((item) => item.value),
        "#10b981",
        "Ingresos Mensuales"
      );

      const egresosSVG = generateLineChartSVG(
        monthlyEgresos.slice(1, currentMonth + 1).map((item) => item.value),
        "#ef4444",
        "Egresos Mensuales"
      );

      // Función para generar gráfica de pastel SVG
      const generatePieChartSVG = (ingresos, egresos) => {
        const width = 400;
        const height = 400;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 120;

        const total = ingresos + egresos;
        if (total === 0) return "<svg></svg>"; // Evitar división por cero

        const ingresosPercentage = (ingresos / total) * 100;
        const egresosPercentage = (egresos / total) * 100;

        // Calcular ángulos (en grados)
        const ingresosAngle = (ingresos / total) * 360;

        // Convertir a radianes para calcular las coordenadas
        const ingresosRadians = (ingresosAngle * Math.PI) / 180;

        // Calcular puntos del arco
        const largeArcFlag = ingresosAngle > 180 ? 1 : 0;

        // Punto final del arco de ingresos
        const x1 = centerX + radius * Math.cos(-Math.PI / 2); // Inicio en la parte superior
        const y1 = centerY + radius * Math.sin(-Math.PI / 2);

        const x2 = centerX + radius * Math.cos(-Math.PI / 2 + ingresosRadians);
        const y2 = centerY + radius * Math.sin(-Math.PI / 2 + ingresosRadians);

        return `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <!-- Fondo -->
            <rect width="${width}" height="${height}" fill="#ffffff"/>
            
            <!-- Título -->
            <text 
              x="${centerX}" 
              y="30" 
              text-anchor="middle" 
              font-size="16" 
              font-weight="bold" 
              fill="#1e293b"
            >
              Distribución Anual
            </text>
            
            <!-- Slice de Ingresos (verde) -->
            <path
              d="M ${centerX},${centerY}
                 L ${x1},${y1}
                 A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2}
                 Z"
              fill="#10b981"
              stroke="#ffffff"
              stroke-width="2"
            />
            
            <!-- Slice de Egresos (rojo) - el resto del círculo -->
            <path
              d="M ${centerX},${centerY}
                 L ${x2},${y2}
                 A ${radius},${radius} 0 ${1 - largeArcFlag},1 ${x1},${y1}
                 Z"
              fill="#ef4444"
              stroke="#ffffff"
              stroke-width="2"
            />
            
            <!-- Leyenda -->
            <g transform="translate(${centerX - 80}, ${height - 80})">
              <!-- Ingresos -->
              <rect x="0" y="0" width="20" height="20" fill="#10b981"/>
              <text x="25" y="15" font-size="12" fill="#1e293b">
                Ingresos: ${ingresosPercentage.toFixed(1)}%
              </text>
              <text x="25" y="30" font-size="11" fill="#64748b">
                ${currencyFormatter.format(ingresos)}
              </text>
              
              <!-- Egresos -->
              <rect x="0" y="40" width="20" height="20" fill="#ef4444"/>
              <text x="25" y="55" font-size="12" fill="#1e293b">
                Egresos: ${egresosPercentage.toFixed(1)}%
              </text>
              <text x="25" y="70" font-size="11" fill="#64748b">
                ${currencyFormatter.format(egresos)}
              </text>
            </g>
            
            <!-- Círculo de fondo para el texto del balance -->
            <circle 
              cx="${centerX}" 
              cy="${centerY}" 
              r="60" 
              fill="#ffffff" 
              fill-opacity="0.75"
              stroke="#e2e8f0"
              stroke-width="2"
            />
            
            <!-- Texto central con balance -->
            <text 
              x="${centerX}" 
              y="${centerY - 10}" 
              text-anchor="middle" 
              font-size="14" 
              font-weight="bold" 
              fill="#64748b"
            >
              Balance
            </text>
            <text 
              x="${centerX}" 
              y="${centerY + 15}" 
              text-anchor="middle" 
              font-size="18" 
              font-weight="bold" 
              fill="${balanceAnual >= 0 ? "#10b981" : "#ef4444"}"
            >
              ${currencyFormatter.format(balanceAnual)}
            </text>
          </svg>
        `;
      };

      // Generar gráfica de pastel
      const pieChartSVG = generatePieChartSVG(
        totalIngresosAnual,
        totalEgresosAnual
      );

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #1e293b;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #6F09EA;
              padding-bottom: 15px;
            }
            .header h1 {
              color: #6F09EA;
              margin: 0 0 5px 0;
              font-size: 28px;
            }
            .header p {
              margin: 3px 0;
              color: #64748b;
              font-size: 12px;
            }
            .balance-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 25px;
              gap: 15px;
            }
            .balance-card {
              flex: 1;
              padding: 15px;
              border-radius: 8px;
              border: 2px solid;
            }
            .balance-card.positive {
              background-color: #f0fdf4;
              border-color: #86efac;
            }
            .balance-card.negative {
              background-color: #fef2f2;
              border-color: #fca5a5;
            }
            .balance-card h3 {
              margin: 0 0 8px 0;
              font-size: 14px;
              color: #64748b;
            }
            .balance-card .amount {
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            .balance-card.positive .amount {
              color: #16a34a;
            }
            .balance-card.negative .amount {
              color: #dc2626;
            }
            .section {
              margin-bottom: 25px;
            }
            .section h2 {
              color: #6F09EA;
              font-size: 18px;
              margin-bottom: 10px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th {
              background-color: #f1f5f9;
              padding: 10px;
              text-align: left;
              font-size: 12px;
              color: #475569;
              border-bottom: 2px solid #cbd5e1;
            }
            td {
              font-size: 12px;
              color: #1e293b;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
            }
            .summary {
              background-color: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              font-size: 14px;
            }
            .summary-row.total {
              font-weight: bold;
              font-size: 16px;
              border-top: 2px solid #cbd5e1;
              padding-top: 10px;
              margin-top: 5px;
            }
            .chart-container {
              margin: 20px 0;
              padding: 15px;
              background-color: #ffffff;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .chart-container canvas {
              max-height: 300px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #6F09EA;">MQerKAcademy</p>
            <p style="margin: 0; font-size: 12px; color: #64748b; margin-bottom: 10px;">Sistema Fenix Retail</p>
            <h1>Reporte Financiero ${currentYear}</h1>
            <p>Generado el ${currentDate}</p>
            <p>Período: Enero - ${currentMonthName} ${currentYear}</p>
          </div>
          
          <div class="balance-section">
            <div class="balance-card ${balanceAnual >= 0 ? "positive" : "negative"}">
              <h3>Balance Total ${currentYear}</h3>
              <p class="amount">${currencyFormatter.format(balanceAnual)}</p>
            </div>
            <div class="balance-card ${balanceMesActual >= 0 ? "positive" : "negative"}">
              <h3>Balance ${currentMonthName}</h3>
              <p class="amount">${currencyFormatter.format(balanceMesActual)}</p>
            </div>
          </div>
          
          <div class="summary">
            <div class="summary-row">
              <span>Total Ingresos ${currentYear}:</span>
              <span>${currencyFormatter.format(totalIngresosAnual)}</span>
            </div>
            <div class="summary-row">
              <span>Total Egresos ${currentYear}:</span>
              <span>${currencyFormatter.format(totalEgresosAnual)}</span>
            </div>
            <div class="summary-row total">
              <span>Balance Anual:</span>
              <span style="color: ${balanceAnual >= 0 ? "#16a34a" : "#dc2626"}">
                ${currencyFormatter.format(balanceAnual)}
              </span>
            </div>
          </div>
          
          <div class="summary">
            <div class="summary-row">
              <span>Ingresos ${currentMonthName}:</span>
              <span>${currencyFormatter.format(ingresosMesActual)}</span>
            </div>
            <div class="summary-row">
              <span>Egresos ${currentMonthName}:</span>
              <span>${currencyFormatter.format(egresosMesActual)}</span>
            </div>
            <div class="summary-row total">
              <span>Balance ${currentMonthName}:</span>
              <span style="color: ${balanceMesActual >= 0 ? "#16a34a" : "#dc2626"}">
                ${currencyFormatter.format(balanceMesActual)}
              </span>
            </div>
          </div>
          
          <!-- Gráficas -->
          <div class="section">
            <h2>Gráficas Comparativas</h2>
            <div class="chart-container">
              ${ingresosSVG}
            </div>
            <div class="chart-container">
              ${egresosSVG}
            </div>
            <div class="chart-container" style="display: flex; justify-content: center;">
              ${pieChartSVG}
            </div>
          </div>
          
          <div class="section">
            <h2>Desglose de Ingresos ${currentYear}</h2>
            <table>
              <thead>
                <tr>
                  <th>Mes</th>
                  <th style="text-align: right;">Monto</th>
                </tr>
              </thead>
              <tbody>
                ${ingresosTable}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h2>Desglose de Egresos ${currentYear}</h2>
            <table>
              <thead>
                <tr>
                  <th>Mes</th>
                  <th style="text-align: right;">Monto</th>
                </tr>
              </thead>
              <tbody>
                ${egresosTable}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <p style="font-weight: bold; color: #6F09EA; margin-bottom: 5px;">MQerKAcademy</p>
            <p>Reporte generado automáticamente por Fenix Retail</p>
            <p>© ${new Date().getFullYear()} MQerKAcademy - Todos los derechos reservados</p>
          </div>
        </body>
        </html>
      `;

      // Generar nombre del archivo PDF
      const yearShort = currentYear.toString().slice(-2); // Últimos 2 dígitos del año
      const monthNameShort = currentMonthName.substring(0, 3); // Primeras 3 letras del mes
      const pdfFileName = `Reporte-FenixRetail_Ene-${monthNameShort}-${yearShort}.pdf`;

      const { uri } = await Print.printToFileAsync({
        html: html,
      });

      // Renombrar el archivo
      const newUri = `${FileSystem.cacheDirectory}${pdfFileName}`;
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      console.log("Reporte PDF generado en:", newUri);
      await shareAsync(newUri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
        dialogTitle: pdfFileName,
      });
    } catch (error) {
      console.error("Error al generar reporte PDF:", error);
      Alert.alert("Error", "No se pudo generar el reporte: " + error.message);
    }
  };

  return (
    <ScrollView
      className={`flex-1 p-4 bg-slate-50`}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={handleRefresh}
          tintColor="#6F09EA"
        />
      }
    >
      <View className="mb-6">
        {/* Header compacto con título, selectores y botón */}
        <View className="flex-row justify-between items-center gap-3 mb-4">
          <Text className="text-2xl font-bold text-slate-800">
            Reporte Anual
          </Text>

          <View className="flex-row gap-2 items-center">
            {/* Selector de Mes */}
            <View style={{ width: 130 }}>
              <Dropdown
                style={styles.dropdownIngresos}
                data={monthOptions}
                labelField="label"
                valueField="value"
                placeholder="Mes"
                value={selectedMonth}
                onChange={(item) => setSelectedMonth(item.value)}
              />
            </View>
            {/* Selector de Año */}
            <View style={{ width: 100 }}>
              <Dropdown
                style={[
                  styles.dropdownIngresos,
                  loadingYears && { opacity: 0.5 },
                ]}
                containerStyle={loadingYears && { opacity: 0.5 }}
                data={availableYears}
                labelField="label"
                valueField="value"
                placeholder={loadingYears ? "Año" : "Año"}
                value={year}
                onChange={(item) => setYear(item.value)}
                disable={loadingYears}
              />
            </View>

            {/* Botón PDF */}
            <TouchableOpacity
              onPress={generateReportPDF}
              className="bg-green-600 px-3 py-2 rounded-lg flex-row items-center gap-2"
              disabled={loading}
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              <Svg height="16" width="16" viewBox="0 0 512 512">
                <Path
                  fill="#ffffff"
                  d="M378.413,0H208.297h-13.182L185.8,9.314L57.02,138.102l-9.314,9.314v13.176v265.514c0,47.36,38.528,85.895,85.896,85.895h244.811c47.353,0,85.881-38.535,85.881-85.895V85.896C464.294,38.528,425.766,0,378.413,0z M432.497,426.105c0,29.877-24.214,54.091-54.084,54.091H133.602c-29.884,0-54.098-24.214-54.098-54.091V160.591h83.716c24.885,0,45.077-20.178,45.077-45.07V31.804h170.116c29.87,0,54.084,24.214,54.084,54.092V426.105z"
                />
                <Path
                  fill="#ffffff"
                  d="M171.947,252.785h-28.529c-5.432,0-8.686,3.533-8.686,8.825v73.754c0,6.388,4.204,10.599,10.041,10.599c5.711,0,9.914-4.21,9.914-10.599v-22.406c0-0.545,0.279-0.817,0.824-0.817h16.436c20.095,0,32.188-12.226,32.188-29.612C204.136,264.871,192.182,252.785,171.947,252.785z M170.719,294.888h-15.208c-0.545,0-0.824-0.272-0.824-0.81v-23.23c0-0.545,0.279-0.816,0.824-0.816h15.208c8.42,0,13.447,5.027,13.447,12.498C184.167,290,179.139,294.888,170.719,294.888z"
                />
                <Path
                  fill="#ffffff"
                  d="M250.191,252.785h-21.868c-5.432,0-8.686,3.533-8.686,8.825v74.843c0,5.3,3.253,8.693,8.686,8.693h21.868c19.69,0,31.923-6.249,36.81-21.324c1.76-5.3,2.723-11.681,2.723-24.857c0-13.175-0.964-19.557-2.723-24.856C282.113,259.034,269.881,252.785,250.191,252.785z M267.856,316.896c-2.318,7.331-8.965,10.459-18.21,10.459h-9.23c-0.545,0-0.824-0.272-0.824-0.816v-55.146c0-0.545,0.279-0.817,0.824-0.817h9.23c9.245,0,15.892,3.128,18.21,10.46c0.95,3.128,1.62,8.56,1.62,17.93C269.476,308.336,268.805,313.768,267.856,316.896z"
                />
                <Path
                  fill="#ffffff"
                  d="M361.167,252.785h-44.812c-5.432,0-8.7,3.533-8.7,8.825v73.754c0,6.388,4.218,10.599,10.055,10.599c5.697,0,9.914-4.21,9.914-10.599v-26.351c0-0.538,0.265-0.81,0.81-0.81h26.086c5.837,0,9.23-3.532,9.23-8.56c0-5.028-3.393-8.553-9.23-8.553h-26.086c-0.545,0-0.81-0.272-0.81-0.817v-19.425c0-0.545,0.265-0.816,0.81-0.816h32.733c5.572,0,9.245-3.666,9.245-8.553C370.411,256.45,366.738,252.785,361.167,252.785z"
                />
              </Svg>
              <Text className="text-white font-semibold text-sm">Reporte</Text>
            </TouchableOpacity>

            {/* Botón Hoy */}
            <TouchableOpacity
              onPress={() => {
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth() + 1;
                setYear(currentYear);
                setSelectedMonth(currentMonth);
              }}
              className="bg-indigo-600 px-3 py-2 rounded-lg"
              disabled={isCurrentMonthAndYear}
              style={{ opacity: isCurrentMonthAndYear ? 0.5 : 1 }}
            >
              <Text className="text-white font-semibold text-sm">Hoy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Cards */}
        <View className={`gap-3 ${isPortrait ? "flex-col" : "flex-row"}`}>
          {loading ? (
            // Skeleton mientras carga
            <>
              <View className="flex-1 rounded-xl p-4 border border-slate-200 bg-slate-50">
                <Text className="text-sm text-slate-400 mb-1">
                  Balance Total {year}
                </Text>
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" color="#64748b" />
                  <Text className="text-2xl font-extrabold text-slate-300">
                    Cargando...
                  </Text>
                </View>
              </View>

              {year === new Date().getFullYear() && (
                <View className="flex-1 rounded-xl p-4 border border-slate-200 bg-slate-50">
                  <Text className="text-sm text-slate-400 mb-1">
                    Balance{" "}
                    {new Date()
                      .toLocaleString("es-MX", { month: "long" })
                      .charAt(0)
                      .toUpperCase() +
                      new Date()
                        .toLocaleString("es-MX", { month: "long" })
                        .slice(1)}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#64748b" />
                    <Text className="text-2xl font-extrabold text-slate-300">
                      Cargando...
                    </Text>
                  </View>
                </View>
              )}
            </>
          ) : (
            // Datos cargados
            <>
              {/* Balance Mes Seleccionado */}
              <View
                className={`flex-1 rounded-xl p-4 border ${
                  balanceMesSeleccionado >= 0
                    ? "bg-blue-50 border-blue-200"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <Text className="text-sm text-slate-600 mb-1">
                  Balance{" "}
                  {monthOptions.find((m) => m.value === selectedMonth)?.label}
                  {isCurrentMonthAndYear && " (Mes Actual)"}
                </Text>
                <Text
                  className={`text-3xl font-extrabold ${
                    balanceMesSeleccionado >= 0
                      ? "text-blue-600"
                      : "text-orange-600"
                  }`}
                >
                  {currencyFormatter.format(balanceMesSeleccionado)}
                </Text>
              </View>
              {/* Balance Total */}
              <View
                className={`flex-1 rounded-xl p-4 border ${
                  balance >= 0
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <Text className="text-sm text-slate-600 mb-1">
                  Balance Total {year}
                </Text>
                <Text
                  className={`text-3xl font-extrabold ${
                    balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {currencyFormatter.format(balance)}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#6F09EA" />
          <Text className="text-slate-500 mt-4 text-base">
            Cargando reportes...
          </Text>
        </View>
      ) : (
        <View
          className={`flex-1 gap-6 ${
            isPortrait
              ? "flex-col justify-center items-stretch"
              : "flex-row flex-wrap justify-center items-center"
          }`}
        >
          <ChartCard
            title="Ingresos"
            total={totalIngresos}
            data={ingresosData}
            unit="$"
            isPortrait={isPortrait}
            loading={loading}
            totalMesActual={totalIngresosMesSeleccionado}
            monthName={
              monthOptions.find((m) => m.value === selectedMonth)?.label
            }
            isCurrentMonth={isCurrentMonthAndYear}
          />
          <ChartCard
            title="Egresos"
            total={totalEgresos}
            data={egresosData}
            unit="$"
            isPortrait={isPortrait}
            loading={loading}
            totalMesActual={totalEgresosMesSeleccionado}
            monthName={
              monthOptions.find((m) => m.value === selectedMonth)?.label
            }
            isCurrentMonth={isCurrentMonthAndYear}
          />
        </View>
      )}
    </ScrollView>
  );
};

const SeccionCatalogos = ({ catalogos, setCatalogos }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [catalogoLayout, setCatalogoLayout] = useState(null);
  const [tarifarioLayout, setTarifarioLayout] = useState(null);
  const lastTapTimeRef = useRef(null);
  const hintAnim = useRef(new Animated.Value(0)).current;

  // Detección de orientación
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300; // ms
    if (
      lastTapTimeRef.current &&
      now - lastTapTimeRef.current < DOUBLE_PRESS_DELAY
    ) {
      // Doble toque detectado
      setCatalogos((prev) => !prev);
    } else {
      lastTapTimeRef.current = now;
    }
  };

  useEffect(() => {
    if (catalogoLayout && tarifarioLayout) {
      const targetLayout = catalogos ? tarifarioLayout : catalogoLayout;
      const baseWidth = catalogoLayout.width;
      const scaleFactor = targetLayout.width / baseWidth;

      Animated.spring(slideAnim, {
        toValue: targetLayout.x,
        useNativeDriver: true,
        bounciness: 4,
      }).start();

      Animated.spring(scaleAnim, {
        toValue: scaleFactor,
        useNativeDriver: true,
        bounciness: 8,
      }).start();
    }
  }, [catalogos, catalogoLayout, tarifarioLayout]);

  // Animación para el hint de doble toque
  useFocusEffect(
    useCallback(() => {
      const sequence = Animated.sequence([
        Animated.delay(500),
        Animated.timing(hintAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(800),
        Animated.timing(hintAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);
      sequence.start();
      return () => sequence.stop();
    }, [])
  );

  const catalogoImages = [
    require("./assets/Catalogo/Catalogo-01.png"),
    require("./assets/Catalogo/Catalogo-02.png"),
    require("./assets/Catalogo/Catalogo-03.png"),
    require("./assets/Catalogo/Catalogo-04.png"),
    require("./assets/Catalogo/Catalogo-05.png"),
    require("./assets/Catalogo/Catalogo-06.png"),
    require("./assets/Catalogo/Catalogo-07.png"),
    require("./assets/Catalogo/Catalogo-08.png"),
    require("./assets/Catalogo/Catalogo-09.png"),
    require("./assets/Catalogo/Catalogo-10.png"),
    require("./assets/Catalogo/Catalogo-11.png"),
    require("./assets/Catalogo/Catalogo-12.png"),
    require("./assets/Catalogo/Catalogo-13.png"),
    require("./assets/Catalogo/Catalogo-14.png"),
  ];

  const tarifarioImages = [
    require("./assets/Tarifario/Tarifario-1.jpg"),
    require("./assets/Tarifario/Tarifario-2.jpg"),
    require("./assets/Tarifario/Tarifario-3.jpg"),
    require("./assets/Tarifario/Tarifario-4.jpg"),
    require("./assets/Tarifario/Tarifario-5.jpg"),
  ];

  const imagesToShow = catalogos ? tarifarioImages : catalogoImages;

  return (
    <View className="flex-1 bg-gradient-to-b from-slate-100 to-slate-50">
      {/* Header mejorado con cards separadas */}
      <View className="p-4 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <View className="flex-row gap-3 justify-center">
          {/* Botón Catálogo */}
          <Pressable
            onPress={() => setCatalogos(false)}
            style={{
              flex: 1,
              maxWidth: 180,
            }}
            android_ripple={{
              color: !catalogos
                ? "rgba(255,255,255,0.3)"
                : "rgba(111,9,234,0.1)",
              borderless: false,
              radius: 16,
            }}
          >
            {({ pressed }) => (
              <View
                style={{
                  backgroundColor: !catalogos ? "#6F09EA" : "white",
                  borderRadius: 16,
                  padding: 16,
                  shadowColor: !catalogos ? "#6F09EA" : "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: !catalogos ? 0.3 : 0.1,
                  shadowRadius: !catalogos ? 12 : 4,
                  elevation: !catalogos ? 8 : 2,
                  borderWidth: !catalogos ? 0 : 2,
                  borderColor: !catalogos ? "transparent" : "#e2e8f0",
                  transform: [{ scale: !catalogos ? 1.02 : 1 }],
                  opacity: pressed ? 0.7 : 1,
                }}
              >
                <View className="items-center gap-2">
                  <View
                    style={{
                      backgroundColor: !catalogos
                        ? "rgba(255,255,255,0.2)"
                        : "#f1f5f9",
                      borderRadius: 12,
                      padding: 8,
                    }}
                  >
                    <Svg
                      height="28"
                      viewBox="0 -960 960 960"
                      width="28"
                      fill={!catalogos ? "#ffffff" : "#6F09EA"}
                    >
                      <Path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z" />
                    </Svg>
                  </View>
                  <Text
                    style={{
                      color: !catalogos ? "#ffffff" : "#475569",
                      fontSize: 15,
                      fontWeight: "700",
                      letterSpacing: 0.5,
                    }}
                  >
                    CATÁLOGO
                  </Text>
                  {!catalogos && (
                    <View
                      style={{
                        width: 40,
                        height: 3,
                        backgroundColor: "white",
                        borderRadius: 2,
                        marginTop: 4,
                      }}
                    />
                  )}
                </View>
              </View>
            )}
          </Pressable>

          {/* Botón Tarifario */}
          <Pressable
            onPress={() => setCatalogos(true)}
            style={{
              flex: 1,
              maxWidth: 180,
            }}
            android_ripple={{
              color: catalogos
                ? "rgba(255,255,255,0.3)"
                : "rgba(111,9,234,0.1)",
              borderless: false,
              radius: 16,
            }}
          >
            {({ pressed }) => (
              <View
                style={{
                  backgroundColor: catalogos ? "#6F09EA" : "white",
                  borderRadius: 16,
                  padding: 16,
                  shadowColor: catalogos ? "#6F09EA" : "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: catalogos ? 0.3 : 0.1,
                  shadowRadius: catalogos ? 12 : 4,
                  elevation: catalogos ? 8 : 2,
                  borderWidth: catalogos ? 0 : 2,
                  borderColor: catalogos ? "transparent" : "#e2e8f0",
                  transform: [{ scale: catalogos ? 1.02 : 1 }],
                  opacity: pressed ? 0.7 : 1,
                }}
              >
                <View className="items-center gap-2">
                  <View
                    style={{
                      backgroundColor: catalogos
                        ? "rgba(255,255,255,0.2)"
                        : "#f1f5f9",
                      borderRadius: 12,
                      padding: 8,
                    }}
                  >
                    <Svg
                      height="28"
                      viewBox="0 -960 960 960"
                      width="28"
                      fill={catalogos ? "#ffffff" : "#6F09EA"}
                    >
                      <Path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" />
                    </Svg>
                  </View>
                  <Text
                    style={{
                      color: catalogos ? "#ffffff" : "#475569",
                      fontSize: 15,
                      fontWeight: "700",
                      letterSpacing: 0.5,
                    }}
                  >
                    TARIFARIO
                  </Text>
                  {catalogos && (
                    <View
                      style={{
                        width: 40,
                        height: 3,
                        backgroundColor: "white",
                        borderRadius: 2,
                        marginTop: 4,
                      }}
                    />
                  )}
                </View>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Contenedor de imágenes con efecto libro */}
      <View style={{ flex: 1, padding: isLandscape ? 8 : 16 }}>
        <Tab.Navigator
          key={catalogos ? "tarifario" : "catalogo"}
          tabBarPosition="bottom"
          tabBar={(props) => <MinimalistTabBar {...props} />}
        >
          {imagesToShow.map((imageSource, index) => (
            <Tab.Screen key={index} name={`Página ${index + 1}`}>
              {() => (
                <Pressable
                  onPress={handleDoubleTap}
                  className="flex-1 items-center justify-center"
                >
                  <View
                    style={{
                      width: isLandscape ? "98%" : "95%",
                      height: isLandscape ? "98%" : "95%",
                      backgroundColor: "white",
                      borderRadius: 16,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.15,
                      shadowRadius: 16,
                      elevation: 10,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: "#e2e8f0",
                    }}
                  >
                    <Image
                      source={imageSource}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      resizeMode="contain"
                    />
                  </View>
                </Pressable>
              )}
            </Tab.Screen>
          ))}
        </Tab.Navigator>
      </View>

      {/* Hint animado mejorado */}
      <Animated.View
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: [
            { translateX: -120 },
            { translateY: -35 },
            { scale: hintAnim },
          ],
          opacity: hintAnim,
        }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 flex-row items-center gap-x-3 shadow-2xl"
        pointerEvents="none"
      >
        <View className="bg-white/20 rounded-full p-2">
          <Svg height="24" viewBox="0 0 24 24" width="24" fill="white">
            <Path d="M18.5 10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S17 8.17 17 9s.67 1.5 1.5 1.5zm-5 0c.83 0 1.5-.67 1.5-1.5S14.33 7.5 13.5 7.5 12 8.17 12 9s.67 1.5 1.5 1.5zm-5 0c.83 0 1.5-.67 1.5-1.5S9.33 7.5 8.5 7.5 7 8.17 7 9s.67 1.5 1.5 1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </Svg>
        </View>
        <Text className="text-white font-bold text-base">
          Doble toque para cambiar
        </Text>
      </Animated.View>
    </View>
  );
};

const MinimalistTabBar = ({ state }) => {
  const totalPages = state.routes.length;
  const currentPage = state.index + 1;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#f8fafc",
      }}
    >
      <Text style={{ fontWeight: "bold", color: "#334155" }}>
        Página {currentPage} de {totalPages}
      </Text>
    </View>
  );
};

const styles_registro_venta = StyleSheet.create({
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "white",
    paddingHorizontal: 8,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: "center",
  },
  dateSeparator: {
    fontSize: 16,
    color: "#9ca3af",
  },
});

// Silenciar advertencias específicas de RN Web de terceros (no corregibles desde nuestro código)
if (Platform.OS === "web") {
  LogBox.ignoreLogs([
    "props.pointerEvents is deprecated",
    "TouchableWithoutFeedback is deprecated",
    "@supabase/gotrue-js: Navigator LockManager returned a null lock",
    "LockManager returned a null lock",
  ]);
  // Filtro defensivo para mensajes en consola del entorno web
  const originalWarn = console.warn;
  console.warn = (...args) => {
    try {
      const msg = typeof args[0] === "string" ? args[0] : "";
      if (
        msg.includes("props.pointerEvents is deprecated") ||
        msg.includes("TouchableWithoutFeedback is deprecated") ||
        msg.includes(
          "@supabase/gotrue-js: Navigator LockManager returned a null lock"
        ) ||
        msg.includes("LockManager returned a null lock")
      ) {
        return; // omitir sólo estos mensajes
      }
    } catch {}
    originalWarn(...args);
  };
}

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 25,
  },
  scrollView: {
    width: "100%",
  },
  head: { height: 40, backgroundColor: "#eef2f5" },
  headText: { textAlign: "center", fontWeight: "bold", fontSize: 13 },
  row: { flexDirection: "row", backgroundColor: "#f8fafc" },
  tableText: {
    textAlign: "center",
    fontSize: 12,
  },
  dropdown: {
    height: 40,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%",
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  input: {
    justifyContent: "center",
  },
  dropdownModal: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
  },
  dropdownIngresos: {
    height: 42,
    backgroundColor: "white",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 5,
    fontWeight: "500",
  },
  errorInput: {
    borderColor: "#ef4444", // Rojo para el borde
    borderWidth: 1,
  },
  dropdownDisabled: {
    backgroundColor: "#e5e7eb",
    borderColor: "#d1d5db",
  },
  dropdownItemText: {
    color: "#1e293b",
    fontSize: 16,
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
    height: 45,
    width: 120,
    marginLeft: 10,
  },
  currencySymbol: {
    fontSize: 16,
    color: "#4b5563",
    marginRight: 4,
  },
  currencyInput: {
    flex: 1,
    fontSize: 16,
    minWidth: 40,
    maxWidth: "100%",
    textAlign: "right",
    alignSelf: "center",
  },
  currencyInputPlaceholder: {
    color: "#9ca3af",
  },
  currencyCents: {
    fontSize: 16,
    color: "#6b7280",
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  stepButtonDisabled: {
    backgroundColor: "#f1f5f9",
    borderColor: "#e2e8f0",
  },
  stepButtonText: {
    color: "#4f46e5",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 22,
  },
  stepButtonTextDisabled: {
    color: "#9ca3af",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipDisabled: {
    backgroundColor: "#f8fafc",
    opacity: 0.6,
  },
  chipText: {
    color: "#475569",
    fontWeight: "500",
    fontSize: 12,
  },
  chipSelected: {
    backgroundColor: "#eef2ff",
    borderColor: "#a5b4fc",
  },
  chipTextSelected: {
    color: "#4338ca",
    fontWeight: "bold",
  },
  chipPrimary: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  chipTextPrimary: {
    color: "#b45309",
    fontWeight: "bold",
  },
  chipClear: {
    backgroundColor: "#fee2e2",
    borderColor: "#fca5a5",
  },
  chipTextClear: {
    color: "#b91c1c",
    fontWeight: "bold",
  },
  chipTextDisabled: {
    color: "#9ca3af",
    fontWeight: "500",
  },
});

const styles_finanzas = StyleSheet.create({
  half: {
    width: "48%", // Ancho para crear el efecto de dos columnas
  },
  dropdown: {
    height: 50,
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
});
