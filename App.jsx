import "react-native-gesture-handler";
import {
  Text,
  View,
  Pressable,
  Image,
  useWindowDimensions,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  TextInput,
  LogBox,
  Modal,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  FlatList,
  LayoutAnimation,
  UIManager,
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

import { FlashList } from "@shopify/flash-list";

import Svg, { Path } from "react-native-svg";
import { Table, Row, TableWrapper, Cell } from "react-native-table-component";
import Ripple from "react-native-material-ripple";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import { BlurView } from "expo-blur";
import Slider from "@react-native-community/slider";
import {
  Calendar,
  CalendarList,
  CalendarProvider,
  Agenda,
  LocaleConfig,
  ExpandableCalendar,
} from "react-native-calendars";

import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import HeaderAdmin from "./components/HeaderAdmin";
import PagoTarjetaStripe from "./components/pagos/PagoTarjetaStripe";
import MapViewWrapper from "./components/MapViewWrapper";
import { supabase } from "./lib/supabase";
import { useAuthContext } from "./hooks/use-auth-context";
import RegistroAsesor from "./components/asesores/RegistroAsesor";

import RegistroVenta from "./components/ventas/RegistroVenta";
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
          </Drawer.Navigator>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

function AppHeader({ navigation, route }) {
  const { profile } = useAuthContext();
  // Títulos de sección según la ruta actual del Drawer
  const routeTitles = {
    Inicio: "Panel Principal",
    Estudiantes: "Lista de Estudiantes",
    Asesores: "Asesores",
    Pagos: "Comprobantes de Pago",
    Finanzas: "Reportes de Pagos",
    Calendario: "Calendario",
    Cursos: "Cursos",
  };
  const currentSectionTitle = routeTitles[route?.name] || route?.name || "";
  return (
    <HeaderAdmin
      logoSource={require("./assets/MQerK_logo.png")}
      onLogoPress={() => navigation?.toggleDrawer?.()}
      showMenuButton={true}
      onMenuPress={() => navigation?.toggleDrawer?.()}
      title="Fenix Rentail"
      subtitle={currentSectionTitle}
      adminProfile={{
        name: profile?.full_name || "Usuario",
        email: profile?.email || "",
        role: "Admin",
        lastLogin: new Date().toLocaleString(),
      }}
      unreadCount={0}
      notifications={[]}
      onNotificationPress={() => {}}
      onMarkAllAsRead={() => {}}
      onLogout={() =>
        supabase.auth.signOut().catch((e) => console.error("Sign out error", e))
      }
    />
  );
}

const CustomDrawerContent = (props) => {
  const { state, ...rest } = props;
  // Filtramos la ruta 'LogOut' para que no aparezca en la lista principal
  const newState = {
    ...state,
    routes: state.routes.filter((item) => item.name !== "LogOut"),
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList state={newState} {...rest} />
      </DrawerContentScrollView>
      <View style={{ padding: 5, borderTopColor: "#4a4a4a" }}>
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
  onEdit,
  onReprint,
}) => {
  const [sortKey, setSortKey] = useState("monto_pendiente");
  const [sortDir, setSortDir] = useState("desc");

  const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = data.filter((r) => {
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
            <SortHeader label="Pendiente" k="monto_pendiente" flex={2} center />
            <SortHeader label="Grupo" k="grupo" flex={1.5} center />
            <SortHeader label="Acciones" k={null} flex={1.5} center />
          </View>
          {filtered.length > 0 ? (
            filtered.map((estudiante, index) => (
              <View
                key={estudiante.id_estudiante}
                className={`flex-row items-center border-t border-slate-200 ${index % 2 ? "bg-white" : "bg-slate-50"}`}
              >
                <Text
                  style={{ flex: 3 }}
                  className="p-3 text-slate-700"
                  numberOfLines={1}
                >
                  {estudiante.curso_asignado}
                </Text>
                <Text
                  style={{ flex: 3 }}
                  className="p-3 text-slate-800"
                  numberOfLines={1}
                >
                  {estudiante.nombre_estudiante}
                </Text>
                <Text
                  style={{ flex: 2, textAlign: "center" }}
                  className="p-3 text-slate-700 font-medium"
                >
                  {currencyFormatter.format(estudiante.monto_pendiente || 0)}
                </Text>
                <Text
                  style={{ flex: 1.5, textAlign: "center" }}
                  className="p-3 text-slate-700"
                >
                  {estudiante.grupo}
                </Text>
                <View
                  style={{ flex: 1.5 }}
                  className="p-3 flex-row justify-center items-center gap-x-4"
                >
                  <TouchableOpacity onPress={() => onEdit(estudiante)}>
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
                    onPress={() => onReprint(estudiante.id_estudiante)}
                  >
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
            ))
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

const ScreenEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRefresh = async () => {
    if (isRefetching || loading) return;
    setIsRefetching(true);
    const { data, error } = await supabase
      .from("estudiantes")
      .select("*")
      .order("id_estudiante", { ascending: false });
    if (!error && data) setEstudiantes(data);
    setTimeout(() => setIsRefetching(false), 300);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchEstudiantes = async () => {
        if (estudiantes.length > 0) setIsRefetching(true);
        else setLoading(true);

        const { data, error } = await supabase
          .from("estudiantes")
          .select("*")
          .order("id_estudiante", { ascending: false });

        if (!error && data) setEstudiantes(data);
        setLoading(false);
        setIsRefetching(false);
      };
      fetchEstudiantes();
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
              .from("estudiantes")
              .delete()
              .eq("id_estudiante", id);
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
    console.log("Agregando nuevo estudiante");
    // Aquí iría la lógica para mostrar el formulario de registro
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

          <TablaEstudiantes
            data={estudiantes}
            query={searchTerm}
            isRefetching={isRefetching}
            onRefresh={handleRefresh}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
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
}) => {
  const [sortKey, setSortKey] = useState("nombre_estudiante");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = data.filter((r) => {
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
            <SortHeader label="Curso" k="curso_asignado" flex={3} />
            <SortHeader label="Grupo" k="grupo" flex={2} center />
            <SortHeader label="Acciones" k={null} flex={1.5} center />
          </View>
          {filtered.length > 0 ? (
            filtered.map((estudiante, index) => (
              <View
                key={estudiante.id_estudiante}
                className={`flex-row items-center border-t border-slate-200 ${index % 2 ? "bg-white" : "bg-slate-50"}`}
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
                <View
                  style={{ flex: 1.5 }}
                  className="p-3 flex-row justify-center items-center gap-x-4"
                >
                  <TouchableOpacity onPress={() => onEdit(estudiante)}>
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

  // Estado para controlar la vista: 'list' o 'form'
  const [viewMode, setViewMode] = useState("list");
  const [editingAsesor, setEditingAsesor] = useState(null);

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

  // Pasamos el asesor a editar y cambiamos de vista
  const handleEdit = (asesor) => {
    setEditingAsesor(asesor);
    setViewMode("form");
  };

  // Pasamos el asesor a ver y cambiamos de vista
  const handleView = (asesor) => {
    setEditingAsesor(asesor); // Reutilizamos el estado
    setViewMode("view");
  };

  // Cambiamos a la vista de formulario para agregar uno nuevo
  const handleAdd = () => {
    setEditingAsesor(null); // Nos aseguramos de que no haya datos de edición
    setViewMode("form");
  };

  // Si estamos en modo formulario, renderizamos RegistroAsesor
  if (viewMode === "form") {
    return (
      <RegistroAsesor
        key={editingAsesor ? `edit-${editingAsesor.id_asesor}` : "new"}
        asesorToEdit={editingAsesor}
        onFormClose={(currentForm) => {
          const initialData = editingAsesor
            ? {
                nombre_asesor: editingAsesor.nombre_asesor || "",
                correo_asesor: editingAsesor.correo_asesor || "",
                telefono_asesor: editingAsesor.telefono_asesor || "",
                direccion_asesor: editingAsesor.direccion_asesor || "",
                municipio_asesor: editingAsesor.municipio_asesor || "",
                rfc_asesor: editingAsesor.rfc_asesor || "",
                nacionalidad_asesor: editingAsesor.nacionalidad_asesor || "",
                genero_asesor: editingAsesor.genero_asesor || "",
              }
            : {
                nombre_asesor: "",
                correo_asesor: "",
                telefono_asesor: "",
                direccion_asesor: "",
                municipio_asesor: "",
                rfc_asesor: "",
                nacionalidad_asesor: "",
                genero_asesor: "",
              };

          const hasChanges = !equal(currentForm, initialData);

          if (!hasChanges) {
            setViewMode("list");
            return;
          }

          Alert.alert(
            "Cambios sin guardar",
            "Tienes cambios sin guardar. ¿Deseas descartarlos?",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Descartar",
                style: "destructive",
                onPress: () => setViewMode("list"),
              },
            ]
          );
        }}
      />
    );
  }
  if (viewMode === "view") {
    return (
      <RegistroAsesor
        asesorToEdit={editingAsesor}
        onFormClose={() => {
          setViewMode("list");
          handleRefresh(); // Refresca la lista al salir de la vista
        }}
        viewOnly={true}
      />
    );
  }

  // Vista de la tabla de asesores
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
                placeholder="Buscar asesor..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="ml-2 text-base"
              />
            </View>
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
              <Text className="text-white font-bold ml-2">Agregar Asesor</Text>
            </TouchableOpacity>
          </View>

          <TablaAsesores
            data={asesores}
            query={searchTerm}
            isRefetching={isRefetching}
            onRefresh={handleRefresh}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </>
      )}
    </View>
  );
};

const TablaAsesores = ({
  data,
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
          {/* Encabezados */}
          <View className="bg-slate-100 border-b border-slate-200 flex-row">
            <SortHeader label="Nombre" k="nombre_asesor" flex={3} />
            <SortHeader label="Correo" k="correo_asesor" flex={5} />
            <SortHeader label="Teléfono" k="telefono_asesor" flex={2} />
            <SortHeader label="Acciones" k={null} flex={1.3} center />
          </View>
          {/* Filas */}
          {filtered.length > 0 ? (
            filtered.map((asesor, index) => (
              <Pressable
                key={asesor.id_asesor}
                className={`flex-row items-center border-t border-slate-200 ${index % 2 ? "bg-white" : "bg-slate-50"}`}
                onPress={() => onView(asesor)}
                android_ripple={{ color: "rgba(0,0,0,0.04)" }}
              >
                <Text
                  style={{ flex: 3 }}
                  className="p-3 text-slate-800"
                  numberOfLines={1}
                >
                  {asesor.nombre_asesor}
                </Text>
                <Text
                  style={{ flex: 5 }}
                  className="p-3 text-slate-700"
                  numberOfLines={1}
                >
                  {asesor.correo_asesor}
                </Text>
                <Text style={{ flex: 2 }} className="p-3 text-slate-700">
                  {asesor.telefono_asesor}
                </Text>
                <View
                  style={{ flex: 1.3 }}
                  className="p-3 flex-row justify-around items-center gap-x-6"
                >
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
                  <TouchableOpacity onPress={() => onDelete(asesor.id_asesor)}>
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
          <View
            className={`flex-1 p-2 flex-col justify-evenly items-center bg-slate-50`}
          >
            <View
              id="contenedor-datos"
              className={`flex bg-[#eff6ff] min-w-[600] rounded-lg p-2`}
            >
              <Text
                className={`text-[#193ca8] font-extrabold pb-4 text-center`}
              >
                Datos bancarios
              </Text>
              <View className={`flex flex-row justify-between`}>
                <View className={`flex-col justify-between`}>
                  <View className={`flex justify-center items-start`}>
                    <Text className={`text-[#255ed8] font-semibold`}>
                      Banco
                    </Text>
                    <Text className={`font-bold text-xl`}>
                      {datosBancarios.banco}
                    </Text>
                  </View>
                  <View>
                    <Text className={`text-[#255ed8] font-semibold`}>
                      Beneficiario
                    </Text>
                    <Text className={`font-bold text-xl`}>
                      {datosBancarios.beneficiario}
                    </Text>
                  </View>
                </View>
                <View className={`flex-col justify-between`}>
                  <View className={`flex justify-center items-start`}>
                    <Text className={`text-[#255ed8] font-semibold`}>
                      Número de cuenta
                    </Text>
                    <TouchableOpacity
                      onPress={() => copiarDatos(datosBancarios.cuenta)}
                    >
                      <Text className={`text-start font-bold text-xl`}>
                        {datosBancarios.cuenta}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text className={`text-[#255ed8] font-semibold`}>
                      Clabe
                    </Text>
                    <TouchableOpacity
                      onPress={() => copiarDatos(datosBancarios.clabe)}
                    >
                      <Text className={`font-bold text-xl`}>
                        {datosBancarios.clabe}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View className={`flex gap-y-2`}>
              <View className={`flex-row items-center gap-x-3`}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#1f2635"
                >
                  <Path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z" />
                </Svg>
                <Text className={`text-[#1f2635] font-bold`}>
                  Instrucciones
                </Text>
              </View>
              <View className={`gap-y-2`}>
                <View className={`flex-row items-baseline gap-x-1`}>
                  <View className={`rounded-full px-1.5 bg-[#297efa]`}>
                    <Text className={`text-white font-bold`}>1</Text>
                  </View>
                  <Text className={`text-[#45474e]`}>
                    Realiza una transferencia SPEI o depósito al número de
                    cuenta/CLABE.
                  </Text>
                </View>
                <View className={`flex-row items-baseline gap-x-1`}>
                  <View className={`rounded-full px-1.5 bg-[#297efa]`}>
                    <Text className={`text-white font-bold`}>2</Text>
                  </View>
                  <Text className={`text-[#45474e]`}>
                    Asegúrate de incluir tu nombre completo en la referencia o
                    concepto de pago.
                  </Text>
                </View>
                <View className={`flex-row items-baseline gap-x-1`}>
                  <View className={`rounded-full px-1.5 bg-[#297efa]`}>
                    <Text className={`text-white font-bold`}>3</Text>
                  </View>
                  <Text className={`text-[#45474e]`}>
                    Sube tu comprobante de transferencia para validación rápida.
                  </Text>
                </View>
                <View className={`self-center`}>
                  <Ripple
                    className={`bg-blue-500 p-2 rounded mt-2`}
                    onPress={handleRedirectToVentas}
                  >
                    <Text className={`text-center text-white`}>
                      Registrar venta
                    </Text>
                  </Ripple>
                </View>
              </View>
            </View>

            <Animated.View
              style={{
                opacity: fadeAnim,
                backgroundColor: "rgba(75, 85, 99, 0.6);",
                padding: 10,
                borderRadius: 10,
                position: "absolute",
                bottom: 40,
              }}
            >
              <Text className={`text-white/80`}>Copiado correctamente</Text>
            </Animated.View>

            <Modal transparent visible={isRedirecting} animationType="fade">
              <View className="flex-1 justify-center items-center bg-black/60">
                <View className="bg-white rounded-lg p-6 flex-row items-center gap-x-4">
                  <ActivityIndicator size="small" color="#6F09EA" />
                  <Text className="text-slate-700 font-medium">
                    Cargando...
                  </Text>
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
              flexDirection: `column`,
              alignItems: "center",
            }}
            className={`bg-slate-50 rounded-lg p-10 gap-y-8`}
          >
            <View
              className={`flex min-w-[600] max-w-[800] bg-[#f0fdf4] rounded-lg p-3 justify-center`}
            >
              <Text className={`font-bold text-[#0b642e] text-lg`}>
                📍 Punto de pago
              </Text>
              <View className={`flex-col items-center`}>
                <View
                  className={`flex-row w-full justify-between px-2 items-center`}
                >
                  <View className={`flex-col justify-center`}>
                    <View className={`flex`}>
                      <Text
                        className={`font-semibold text-[#3da36c] uppercase`}
                      >
                        Dirección
                      </Text>
                      <Text className={`text-lg text-[#3e54d6] max-w-60`}>
                        📍 Calle Juárez entre Av. Independencia y 5 de Mayo,
                        C.P. 68300. En altos de COMPUMAX, Tuxtepec, Oaxaca
                      </Text>
                    </View>
                    <View>
                      <Text
                        className={`font-semibold text-[#3da36c] uppercase`}
                      >
                        Horario
                      </Text>
                      <Text className={`text-lg`}>
                        Lunes a Viernes, 9:00 a 17:00 h
                      </Text>
                    </View>
                    <View>
                      <Text
                        className={`font-semibold text-[#3da36c] uppercase`}
                      >
                        Contacto
                      </Text>
                      <Text className={`text-lg`}>Tel: 287 151 5760</Text>
                    </View>
                  </View>
                  <View
                    className={`flex bg-[#fdfffe] vertical:max-w-[350] overflow-hidden gap-y-6 rounded-lg shadow p-4`}
                  >
                    <View className={`flex-row items-center gap-x-2`}>
                      <Text className={`bg-[#e5f9ed] rounded-full p-2`}>
                        📌
                      </Text>
                      <Text
                        className={`text-[#1f5035] text-xl font-bold uppercase`}
                      >
                        Documentación
                      </Text>
                    </View>
                    <View className={`gap-y-3`}>
                      <View className={`items-baseline flex-row`}>
                        <Text className={`text-[#17bd71]`}>•</Text>
                        <Text className={`text-[#448160]`}>
                          Revisar documento de identificación (INE, pasaporte)
                        </Text>
                      </View>
                      <View className={`items-baseline flex-row`}>
                        <Text className={`text-[#17bd71]`}>•</Text>
                        <Text className={`text-[#448160]`}>
                          Verificar comprobante de domicilio
                        </Text>
                      </View>
                      <View className={`items-baseline flex-row`}>
                        <Text className={`text-[#17bd71]`}>•</Text>
                        <Text className={`text-[#448160]`}>
                          Informar sobre los descuentos disponibles
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className={`items-center justify-center p-4`}>
                  <MapViewWrapper width={600} height={450} />
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
    <View className={`w-full ${containerClassName}`}>
      <Text className="text-slate-700 text-xs font-semibold mb-1 uppercase tracking-wide">
        {label}
      </Text>
      {children}
      {!!error && <Text className="text-red-600 text-xs mt-1">{error}</Text>}
    </View>
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

  const initialFormState = {
    id: null,
    nombre: "",
    descripcion: "",
    monto: "",
    fecha: new Date().toISOString().split("T")[0], // Fecha para el filtro
  };

  const [form, setForm] = useState(
    egresoToEdit
      ? { ...egresoToEdit, monto: String(egresoToEdit.monto) }
      : initialFormState
  );
  const [formErrors, setFormErrors] = useState({ nombre: "" });

  // --- Lógica para el slider de Monto ---
  const [liveMonto, setLiveMonto] = useState(Number(egresoToEdit?.monto) || 0);
  const [maxSliderValue, setMaxSliderValue] = useState(
    Math.max(3000, Number(egresoToEdit?.monto) || 0)
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

  const handleSave = () => {
    if (!form.nombre.trim()) {
      setFormErrors({ nombre: "El nombre es requerido" });
      return;
    }
    onFormClose(form, true);
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
              <View style={{ width: "100%" }}>
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
                className="px-5 py-3 rounded-xl items-center justify-center bg-[#6F09EA]"
                android_ripple={{ color: "rgba(255,255,255,0.15)" }}
              >
                <Text className="text-white font-bold">Guardar</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const RegistroIngreso = ({ ingresoToEdit, onFormClose }) => {
  const initialFormState = {
    id: null,
    alumno: "",
    curso: "",
    fechaInicio: "",
    asesor: null,
    metodoPago: null,
    importe: "",
    estatus: null,
  };

  const [form, setForm] = useState(
    ingresoToEdit
      ? { ...ingresoToEdit, importe: String(ingresoToEdit.importe) }
      : initialFormState
  );
  const [formErrors, setFormErrors] = useState({
    alumno: "",
    curso: "",
    fechaInicio: "",
  });
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [liveImporte, setLiveImporte] = useState(
    Number(ingresoToEdit?.importe) || 0
  );
  const [maxSliderValue, setMaxSliderValue] = useState(
    Math.max(3000, Number(ingresoToEdit?.importe) || 0)
  );

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleImporteChange = (value) => {
    setLiveImporte(value);
    handleInputChange("importe", String(value));
    if (value > maxSliderValue) {
      setMaxSliderValue(value);
    } else if (value === 0 && maxSliderValue !== 3000) {
      setMaxSliderValue(3000);
    }
  };

  const handleSave = () => {
    const { alumno, curso, fechaInicio } = form;
    if (!alumno || !curso || !fechaInicio) {
      setFormErrors({
        alumno: !alumno ? "El nombre es requerido" : "",
        curso: !curso ? "Selecciona un curso" : "",
        fechaInicio: !fechaInicio ? "La fecha es requerida" : "",
      });
      return;
    }
    // Llama a onFormClose pasando el formulario guardado
    onFormClose(form, true);
  };

  const handleCancel = () => {
    const originalData = ingresoToEdit
      ? { ...ingresoToEdit, importe: String(ingresoToEdit.importe) }
      : initialFormState;
    const hasChanges = !equal(form, originalData);

    if (hasChanges) {
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

  // Datos para los dropdowns (pueden venir de props o definirse aquí)
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
              <View style={[styles_finanzas.half, styles_finanzas.fullOnSmall]}>
                <LabeledInput label="Nombre" error={formErrors.alumno}>
                  <TextInput
                    value={form.alumno}
                    onChangeText={(text) => handleInputChange("alumno", text)}
                    placeholder="Ej. Juan Pére"
                    placeholderTextColor="#9ca3af"
                    className={`border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white ${formErrors.alumno ? "border-red-500" : ""}`}
                  />
                </LabeledInput>
              </View>

              <View style={[styles_finanzas.half, styles_finanzas.fullOnSmall]}>
                <LabeledInput label="Curso/Asesoría" error={formErrors.curso}>
                  <Dropdown
                    style={[
                      styles_finanzas.dropdown,
                      formErrors.curso ? { borderColor: "#ef4444" } : {},
                    ]}
                    data={cursos}
                    labelField="label"
                    valueField="value"
                    placeholder="Seleccionar curso"
                    value={form.curso}
                    onChange={(item) => handleInputChange("curso", item.value)}
                    renderRightIcon={renderDropdownIcon}
                  />
                </LabeledInput>
              </View>

              <View style={[styles_finanzas.half, styles_finanzas.fullOnSmall]}>
                <LabeledInput
                  label="Fecha de Inicio"
                  error={formErrors.fechaInicio}
                >
                  <TouchableOpacity
                    onPress={() => setCalendarVisible(true)}
                    className={`border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white h-[50px] justify-center ${formErrors.fechaInicio ? "border-red-500" : ""}`}
                  >
                    <Text
                      className={
                        form.fechaInicio ? "text-slate-900" : "text-gray-400"
                      }
                    >
                      {form.fechaInicio || "Seleccionar fecha"}
                    </Text>
                  </TouchableOpacity>
                </LabeledInput>
              </View>

              <View style={[styles_finanzas.half, styles_finanzas.fullOnSmall]}>
                <LabeledInput label="Método de Pago">
                  <Dropdown
                    style={styles_finanzas.dropdown}
                    data={metodosPago}
                    labelField="label"
                    valueField="value"
                    placeholder="Seleccionar método"
                    value={form.metodoPago}
                    onChange={(item) =>
                      handleInputChange("metodoPago", item.value)
                    }
                    renderRightIcon={renderDropdownIcon}
                  />
                </LabeledInput>
              </View>

              <View style={[styles_finanzas.half, styles_finanzas.fullOnSmall]}>
                <LabeledInput label="Asesor">
                  <Dropdown
                    style={styles_finanzas.dropdown}
                    data={asesores}
                    labelField="label"
                    valueField="value"
                    placeholder="Seleccionar asesor"
                    value={form.asesor}
                    onChange={(item) => handleInputChange("asesor", item.value)}
                    renderRightIcon={renderDropdownIcon}
                  />
                </LabeledInput>
              </View>

              <View style={[styles_finanzas.half, styles_finanzas.fullOnSmall]}>
                <LabeledInput label="Estatus">
                  <Dropdown
                    style={styles_finanzas.dropdown}
                    data={estatusOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Seleccionar estatus"
                    value={form.estatus}
                    onChange={(item) =>
                      handleInputChange("estatus", item.value)
                    }
                    renderRightIcon={renderDropdownIcon}
                  />
                </LabeledInput>
              </View>

              <View style={{ width: "100%" }}>
                <LabeledInput label="Importe">
                  <View className="flex-row items-center">
                    <StepButton
                      type="decrement"
                      disabled={(Number(form.importe) || 0) <= 0}
                      onPress={() =>
                        handleImporteChange(Math.max(0, liveImporte - 50))
                      }
                    />
                    <Slider
                      style={{ flex: 1, height: 40 }}
                      minimumValue={0}
                      maximumValue={maxSliderValue}
                      step={50}
                      value={liveImporte}
                      onSlidingComplete={handleImporteChange}
                      minimumTrackTintColor={"#6F09EA"}
                      maximumTrackTintColor="#d1d5db"
                      thumbTintColor={"#6F09EA"}
                    />
                    <CurrencyInput
                      value={form.importe}
                      onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, "");
                        if (numericText.length > 4) {
                          handleImporteChange(maxSliderValue);
                        } else {
                          handleImporteChange(Number(numericText) || 0);
                        }
                      }}
                    />
                    <StepButton
                      type="increment"
                      onPress={() => handleImporteChange(liveImporte + 50)}
                    />
                  </View>
                  <ChipButtonGroup
                    chips={useMemo(() => {
                      const standardChips = new Set([
                        500, 1000, 1500, 2000, 2500, 3000,
                      ]);
                      // Agrega chips adicionales en incrementos de 500 si el rango se expande
                      if (maxSliderValue > 3000) {
                        for (let i = 3500; i <= maxSliderValue; i += 500) {
                          standardChips.add(i);
                        }
                      }
                      return Array.from(standardChips)
                        .sort((a, b) => a - b)
                        .map((v) => ({
                          label: `$${v}`,
                          value: v,
                        }));
                    }, [maxSliderValue])}
                    selectedValue={Number(form.importe)}
                    onSelect={(value) => {
                      // Primero, actualiza el valor del formulario y el estado visual del slider.
                      handleImporteChange(value);
                      // Luego, asegura que el rango máximo del slider se expanda si es necesario.
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
                className="px-5 py-3 rounded-xl items-center justify-center bg-[#6F09EA]"
                android_ripple={{ color: "rgba(255,255,255,0.15)" }}
              >
                <Text className="text-white font-bold">Guardar</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>

        <Modal
          transparent={true}
          animationType="fade"
          visible={isCalendarVisible}
          onRequestClose={() => setCalendarVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
            <View className="flex-1 justify-center items-center bg-black/50">
              <TouchableWithoutFeedback>
                <View className="bg-white rounded-lg p-5">
                  <Calendar
                    onDayPress={(day) => {
                      handleInputChange("fechaInicio", day.dateString);
                      setCalendarVisible(false);
                    }}
                    markedDates={{
                      [form.fechaInicio]: {
                        selected: true,
                        selectedColor: "#6F09EA",
                      },
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const TablaEgresos = ({ data, onEdit }) => {
  const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      let va = a[sortKey] ?? "";
      let vb = b[sortKey] ?? "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortKey, sortDir]);

  const headers = [
    { title: "ID", flex: 0.8, center: true, key: "id" },
    { title: "Nombre", flex: 4, key: "nombre" },
    { title: "Descripción", flex: 5, key: "descripcion" },
    { title: "Fecha", flex: 2, center: true, key: "fecha" },
    { title: "Monto", flex: 2, center: true, key: "monto" },
    { title: "Acciones", flex: 1, center: true },
  ];

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <View className="bg-slate-100 border-b border-slate-200 flex-row">
            {headers.map((header, index) => (
              <View
                key={index}
                style={{
                  flex: header.flex,
                  alignItems: header.center ? "center" : "flex-start",
                }}
                className="py-3 px-3"
              >
                <Text className="text-slate-800 font-semibold text-xs uppercase tracking-wide">
                  {header.title}
                </Text>
              </View>
            ))}
          </View>

          {/* Body */}
          {sortedData.length > 0 ? (
            sortedData.map((egreso, index) => (
              <View
                key={egreso.id}
                className={`flex-row items-center border-t border-slate-200 ${index % 2 ? "bg-white" : "bg-slate-50"}`}
              >
                <Text
                  style={{ flex: 0.8, textAlign: "center" }}
                  className="p-3 text-slate-600"
                >
                  {egreso.id}
                </Text>
                <Text
                  style={{ flex: 4 }}
                  className="p-3 text-slate-800"
                  numberOfLines={1}
                >
                  {egreso.nombre}
                </Text>
                <Text
                  style={{ flex: 5 }}
                  className="p-3 text-slate-700"
                  numberOfLines={1}
                >
                  {egreso.descripcion}
                </Text>
                <Text
                  style={{ flex: 2, textAlign: "center" }}
                  className="p-3 text-slate-600"
                >
                  {new Date(egreso.fecha).toLocaleDateString("es-MX")}
                </Text>
                <Text
                  style={{ flex: 2, textAlign: "center" }}
                  className="p-3 text-slate-800 font-medium"
                >
                  {currencyFormatter.format(egreso.monto)}
                </Text>
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
            ))
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

      {/* Control de Sincronización */}
      <View className="flex-row items-center gap-x-2">
        <Text className="text-slate-600 text-xs font-semibold uppercase">
          Sincronizar filtros
        </Text>
        <TouchableOpacity
          onPress={() => {
            const newValue = !syncDateFilters;
            setSyncDateFilters(newValue);
            if (newValue)
              setSelectedEgresoDateFilter(selectedIngresoDateFilter);
          }}
          className={`p-1.5 rounded-full ${syncDateFilters ? "bg-indigo-100" : "bg-slate-200"}`}
        >
          <Svg
            height="18"
            viewBox="0 -960 960 960"
            width="18"
            fill={syncDateFilters ? "#6F09EA" : "#64748b"}
          >
            {syncDateFilters ? (
              <Path d="M432-288H288q-79.68 0-135.84-56.23Q96-400.45 96-480.23 96-560 152.16-616q56.16-56 135.84-56h144v72H288q-50 0-85 35t-35 85q0 50 35 85t85 35h144v72Zm-96-156v-72h288v72H336Zm192 156v-72h144q50 0 85-35t35-85q0-50-35-85t-85-35H528v-72h144q79.68 0 135.84 56.23 56.16 56.22 56.16 136Q864-400 807.84-344 751.68-288 672-288H528Z" />
            ) : (
              <Path d="m754-308-56-55q41.78-11.3 67.89-43.65Q792-439 792-480q0-50-35-85t-85-35H528v-72h144q79.68 0 135.84 56.22 56.16 56.23 56.16 136Q864-425 834.5-379T754-308ZM618-444l-72-72h78v72h-6ZM768-90 90-768l51-51 678 678-51 51ZM432-288H288q-79.68 0-135.84-56.16T96-480q0-63.93 38-113.97Q172-644 242-673l70 73h-23q-51 0-86 35t-35 85q0 50 35 85t85 35h144v72Zm-96-156v-72h56l71 72H336Z" />
            )}
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ScreenFinanzas = () => {
  const TablaIngresos = ({ data, onEdit }) => {
    const currencyFormatter = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    });

    const [sortKey, setSortKey] = useState("id");
    const [sortDir, setSortDir] = useState("desc");

    const sortedData = useMemo(() => {
      const sorted = [...data].sort((a, b) => {
        let va = a[sortKey] ?? "";
        let vb = b[sortKey] ?? "";
        if (typeof va === "string") va = va.toLowerCase();
        if (typeof vb === "string") vb = vb.toLowerCase();
        if (va < vb) return sortDir === "asc" ? -1 : 1;
        if (va > vb) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
      return sorted;
    }, [data, sortKey, sortDir]);

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
          <Text className="text-slate-800 font-semibold text-xs uppercase tracking-wide">
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

    const headers = [
      { title: "ID", flex: 0.5, center: true, key: "id" },
      { title: "Alumno", flex: 2.5, key: "alumno" },
      { title: "Curso", flex: 1.5, key: "curso" },
      { title: "Fecha", flex: 1, center: true, key: "fechaInicio" },
      { title: "Importe", flex: 1, center: true, key: "importe" },
      { title: "Estatus", flex: 1, center: true, key: "estatus" },
      { title: "Acciones", flex: 1, center: true },
    ];

    return (
      <View className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <View className="bg-slate-100 border-b border-slate-200 flex-row">
              {headers.map((header, index) => (
                <View
                  key={index}
                  style={{
                    flex: header.flex,
                    alignItems: header.center ? "center" : "flex-start",
                  }}
                  className="py-3 px-3"
                >
                  <Text className="text-slate-800 font-semibold text-xs uppercase tracking-wide">
                    {header.title}
                  </Text>
                </View>
              ))}
            </View>

            {/* Body */}
            {data.length > 0 ? (
              data.map((ingreso, index) => (
                <View
                  key={ingreso.id}
                  className={`flex-row items-center border-t border-slate-200 ${index % 2 ? "bg-white" : "bg-slate-50"}`}
                >
                  <Text
                    style={{ flex: 0.5, textAlign: "center" }}
                    className="p-3 text-slate-600"
                  >
                    {ingreso.id}
                  </Text>
                  <Text
                    style={{ flex: 2 }}
                    className="p-3 text-slate-800"
                    numberOfLines={1}
                  >
                    {ingreso.alumno}
                  </Text>
                  <Text
                    style={{ flex: 2.5 }}
                    className="p-3 text-slate-700"
                    numberOfLines={1}
                  >
                    {ingreso.curso}
                  </Text>
                  <Text
                    style={{ flex: 1, textAlign: "center" }}
                    className="p-3 text-slate-600"
                  >
                    {new Date(ingreso.fechaInicio).toLocaleDateString("es-MX")}
                  </Text>
                  <Text
                    style={{ flex: 1, textAlign: "center" }}
                    className="p-3 text-slate-800 font-medium"
                  >
                    {currencyFormatter.format(ingreso.importe)}
                  </Text>
                  <View
                    style={{ flex: 1, alignItems: "center" }}
                    className="p-3"
                  >
                    <Text
                      className={`text-xs font-bold rounded-full px-2 py-1 ${
                        ingreso.estatus === "Pagado"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ingreso.estatus}
                    </Text>
                  </View>
                  <View
                    style={{ flex: 0.8 }}
                    className="p-3 flex-row justify-center items-center"
                  >
                    <TouchableOpacity onPress={() => onEdit(ingreso)}>
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
              ))
            ) : (
              <View className="p-8 items-center justify-center bg-white">
                <Text className="text-slate-500 text-center font-medium">
                  No hay ingresos para mostrar en este período.
                </Text>
                <Text className="text-slate-400 text-center text-sm mt-1">
                  Intenta con otro mes/año o agrega un nuevo ingreso.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const [ingresosData, setIngresosData] = useState([
    {
      id: 1,
      alumno: "Kelvin Valentin",
      curso: "Curso de React Native",
      fechaInicio: "2024-07-20",
      asesor: "Darian Reyes",
      metodoPago: "Transferencia",
      importe: 1500,
      estatus: "Pagado",
    },
    // Agrega más datos de ejemplo si es necesario
  ]);
  const [egresosData, setEgresosData] = useState([
    {
      id: 1,
      nombre: "Pago de servicio de luz",
      descripcion: "Recibo CFE del mes de Junio",
      monto: 850,
      fecha: "2024-07-15",
    },
    {
      id: 2,
      nombre: "Compra de papelería",
      descripcion: "",
      monto: 1200,
      fecha: "2024-06-25",
    },
  ]);
  const [loading, setLoading] = useState(false); // Desactivamos la carga por defecto

  // --- Estados para controlar la vista del formulario ---
  const [viewMode, setViewMode] = useState("list"); // 'list' o 'form'
  const [editingIngreso, setEditingIngreso] = useState(null);

  // --- Estados para los filtros de fecha ---
  const [selectedIngresoDateFilter, setSelectedIngresoDateFilter] =
    useState("last_month");
  const [selectedEgresoDateFilter, setSelectedEgresoDateFilter] =
    useState("last_month");
  const [syncDateFilters, setSyncDateFilters] = useState(false);
  // --- Estados para controlar la vista de Egresos ---
  const [egresoViewMode, setEgresoViewMode] = useState("list"); // 'list' o 'form'
  const [editingEgreso, setEditingEgreso] = useState(null);

  const initialFormState = {
    id: null,
    alumno: "",
    curso: "",
    fechaInicio: "",
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
  const currentYear = new Date().getFullYear();
  // Genera una lista de los 4 años ANTERIORES al actual.
  const previousYears = Array.from({ length: 4 }, (_, i) => {
    const year = currentYear - 1 - i;
    return { label: String(year), value: `year-${year}` };
  });

  const dateFilterOptions = [
    { label: "Último mes", value: "last_month" },
    { label: "Del mes pasado", value: "previous_month" },
    { label: "Hace 3 meses", value: "3_months_ago" },
    { label: "Este año", value: "this_year" },
    ...previousYears,
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

  const handleOpenForm = (mode, ingreso = null) => {
    setEditingIngreso(ingreso);
    setViewMode("form");
  };

  const handleCloseForm = (savedData, wasSaved) => {
    if (wasSaved && savedData) {
      if (savedData.id) {
        // Es una edición
        const updatedData = ingresosData.map((row) =>
          row.id === savedData.id
            ? { ...savedData, importe: parseFloat(savedData.importe) || 0 }
            : row
        );
        setIngresosData(updatedData);
      } else {
        // Es un nuevo ingreso
        const newEntry = {
          ...savedData,
          id:
            ingresosData.length > 0
              ? Math.max(...ingresosData.map((i) => i.id)) + 1
              : 1,
          importe: parseFloat(savedData.importe) || 0,
        };
        setIngresosData([...ingresosData, newEntry]);
      }
    } else {
      // Si no se guardó (canceló), no hacemos nada con los datos
    }
    // En cualquier caso, volvemos a la lista
    setViewMode("list");
    setEditingIngreso(null);
  };

  const handleOpenEgresoForm = (mode, egreso = null) => {
    setEditingEgreso(egreso);
    setEgresoViewMode("form");
  };

  const handleCloseEgresoForm = (savedData, wasSaved) => {
    if (wasSaved && savedData) {
      if (savedData.id) {
        // Edición
        const updatedData = egresosData.map((row) =>
          row.id === savedData.id
            ? { ...savedData, monto: parseFloat(savedData.monto) || 0 }
            : row
        );
        setEgresosData(updatedData);
      } else {
        // Nuevo
        const newEntry = {
          ...savedData,
          id:
            egresosData.length > 0
              ? Math.max(...egresosData.map((e) => e.id)) + 1
              : 1,
          monto: parseFloat(savedData.monto) || 0,
        };
        setEgresosData([...egresosData, newEntry]);
      }
    }
    setEgresoViewMode("list");
    setEditingEgreso(null);
  };

  const filteredIngresos = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return ingresosData.filter((ingreso) => {
      if (!ingreso.fechaInicio) return false;
      const ingresoDate = new Date(ingreso.fechaInicio);

      switch (selectedIngresoDateFilter) {
        case "last_month": {
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return ingresoDate >= oneMonthAgo && ingresoDate <= now;
        }
        case "previous_month": {
          const startOfPreviousMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
          );
          const endOfPreviousMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            0
          );
          return (
            ingresoDate >= startOfPreviousMonth &&
            ingresoDate <= endOfPreviousMonth
          );
        }
        case "3_months_ago": {
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return ingresoDate >= threeMonthsAgo && ingresoDate <= now;
        }
        case "this_year":
          return ingresoDate.getFullYear() === now.getFullYear();
        default:
          if (selectedIngresoDateFilter.startsWith("year-")) {
            const year = parseInt(selectedIngresoDateFilter.split("-")[1], 10);
            return ingresoDate.getFullYear() === year;
          }
          return false;
      }
    });
  }, [ingresosData, selectedIngresoDateFilter]);

  const filteredEgresos = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return egresosData.filter((egreso) => {
      if (!egreso.fecha) return false;
      const egresoDate = new Date(egreso.fecha);

      switch (selectedEgresoDateFilter) {
        case "last_month": {
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return egresoDate >= oneMonthAgo && egresoDate <= now;
        }
        case "previous_month": {
          const startOfPreviousMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
          );
          const endOfPreviousMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            0
          );
          return (
            egresoDate >= startOfPreviousMonth &&
            egresoDate <= endOfPreviousMonth
          );
        }
        case "3_months_ago": {
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return egresoDate >= threeMonthsAgo && egresoDate <= now;
        }
        case "this_year":
          return egresoDate.getFullYear() === now.getFullYear();
        default:
          if (selectedEgresoDateFilter.startsWith("year-")) {
            const year = parseInt(selectedEgresoDateFilter.split("-")[1], 10);
            return egresoDate.getFullYear() === year;
          }
          return false;
      }
    });
  }, [egresosData, selectedEgresoDateFilter]);

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

  if (viewMode === "form") {
    return (
      <RegistroIngreso
        // Usamos una key para forzar el reseteo del componente al cambiar entre 'nuevo' y 'editar'
        key={editingIngreso ? `edit-${editingIngreso.id}` : "new"}
        ingresoToEdit={editingIngreso}
        onFormClose={handleCloseForm}
      />
    );
  }

  if (egresoViewMode === "form") {
    return (
      <RegistroEgreso
        key={editingEgreso ? `edit-${editingEgreso.id}` : "new"}
        egresoToEdit={editingEgreso}
        onFormClose={handleCloseEgresoForm}
      />
    );
  }

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
    >
      <Tab.Screen name="Ingresos" key="ingresos-tab">
        {/* Añadido key para claridad */}
        {() => (
          <View id="tablas-ingresos" className={`flex-1 bg-slate-50 p-4`}>
            {loading && (
              <View className="absolute inset-0 bg-white/70 justify-center items-center z-10">
                <ActivityIndicator size="large" color="#6F09EA" />
                <Text className="mt-2 text-slate-600">
                  Cargando ingresos...
                </Text>
              </View>
            )}

            <View className="flex-row justify-between items-center mb-4">
              <View className="w-60">
                {/* Contenedor para el Dropdown de Ingresos */}
                <Dropdown
                  style={styles.dropdownIngresos}
                  data={dateFilterOptions}
                  labelField="label"
                  valueField="value"
                  value={selectedIngresoDateFilter}
                  onChange={handleIngresoFilterChange}
                />
              </View>

              <TouchableOpacity
                onPress={() => handleOpenForm("add")}
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
              data={filteredIngresos}
              onEdit={(ingreso) => handleOpenForm("edit", ingreso)}
            />
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen name="Egresos" key="egresos-tab">
        {/* Añadido key para claridad */}
        {() => (
          <View id="tablas-egresos" className={`flex-1 bg-slate-50 p-4`}>
            {loading && (
              <View className="absolute inset-0 bg-white/70 justify-center items-center z-10">
                <ActivityIndicator size="large" color="#6F09EA" />
                <Text className="mt-2 text-slate-600">Cargando egresos...</Text>
              </View>
            )}

            <View className="flex-row justify-between items-center mb-4">
              <View className="w-60">
                {/* Contenedor para el Dropdown de Egresos */}
                <Dropdown
                  style={styles.dropdownIngresos}
                  data={dateFilterOptions}
                  labelField="label"
                  valueField="value"
                  value={selectedEgresoDateFilter}
                  onChange={handleEgresoFilterChange}
                />
              </View>

              <TouchableOpacity
                onPress={() => handleOpenEgresoForm("add")}
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
              data={filteredEgresos}
              onEdit={handleOpenEgresoForm}
            />
          </View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

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
        intensity={Platform.OS === "ios" ? 90 : 60}
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
const ScreenCalendario = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
  const [newEvent, setNewEvent] = useState({
    nombre: "",
    descripcion: "",
    hora: "09",
    minutos: "00",
  });
  const [dateParts, setDateParts] = useState({ day: "", month: "", year: "" });
  const [isDateEditable, setIsDateEditable] = useState(false);
  const [isTimeEditable, setIsTimeEditable] = useState(false);

  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);

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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setIsAddingEvent(true); // Muestra el formulario en línea
  };

  const handleSaveEvent = () => {
    // Aquí iría la lógica para guardar el evento
    console.log("Guardando evento:", {
      ...newEvent,
      fecha: `${dateParts.year}-${dateParts.month}-${dateParts.day}`,
    });
    setIsAddingEvent(false); // Oculta el formulario
  };

  const handleCancelEvent = () => {
    // Simplemente oculta el formulario sin guardar
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setIsAddingEvent(false);
  };

  const calendarRef = useRef(null);

  // Función para volver al día y mes actual
  const goToToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);

    // Si el calendario ya está visible, lo forzamos a navegar al mes actual.
    if (calendarRef.current) {
      const todayDate = new Date();
      const currentDate = new Date(calendarRef.current.props.current);
      const monthDiff =
        (todayDate.getFullYear() - currentDate.getFullYear()) * 12 +
        (todayDate.getMonth() - currentDate.getMonth());
      calendarRef.current.addMonth(monthDiff);
    }
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
  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: "#6F09EA",
      disableTouchEvent: true,
    },
    // Aquí se podrían añadir más fechas con eventos (puntos, etc.)
  };

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
                Eventos para el{" "}
                <Text className="text-indigo-600">
                  {(() => {
                    // Solución robusta para el problema de la zona horaria.
                    const parts = selectedDate.split("-");
                    const utcDate = new Date(
                      Date.UTC(parts[0], parts[1] - 1, parts[2])
                    );
                    return utcDate.toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      timeZone: "UTC",
                    });
                  })()}
                </Text>
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

            {isAddingEvent ? (
              // --- FORMULARIO PARA AGREGAR EVENTO ---
              <ScrollView className="p-2">
                <Text className="text-xl font-bold mb-4 text-slate-800">
                  Agregar Evento
                </Text>

                {/* Campo Nombre del Evento */}
                <LabeledInput
                  label="Nombre del Evento"
                  containerClassName="mb-4"
                >
                  <TextInput
                    className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white"
                    placeholder="Ej. Reunión de equipo"
                    value={newEvent.nombre}
                    onChangeText={(text) =>
                      setNewEvent((prev) => ({ ...prev, nombre: text }))
                    }
                  />
                </LabeledInput>

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
                      onChangeText={(text) =>
                        setNewEvent((prev) => ({ ...prev, hora: text }))
                      }
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text className="text-xl font-bold text-slate-400">:</Text>
                    <TextInput
                      className="flex-1 text-center text-base py-2"
                      placeholder="MM"
                      value={newEvent.minutos}
                      editable={isTimeEditable}
                      onChangeText={(text) =>
                        setNewEvent((prev) => ({ ...prev, minutos: text }))
                      }
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
                    className="bg-indigo-600 px-5 py-3 rounded-lg shadow-md shadow-indigo-600/30"
                  >
                    <Text className="text-white font-bold">Guardar Evento</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              // --- VISTA POR DEFECTO (LISTA DE EVENTOS O MENSAJE) ---

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
                  No hay eventos para este día.
                </Text>
                <Text className="text-slate-400 text-sm mt-1 text-center">
                  Selecciona otro día o agrega un nuevo evento.
                </Text>
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
      const id = String(r.id_curso || "").toLowerCase();
      return nombre.includes(q) || precio.includes(q) || id.includes(q);
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
            <SortHeader label="#" k="id_curso" flex={0.1} center />
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
                <View style={{ flex: 0.1 }} className="py-3 px-3 items-center">
                  <Text className="text-slate-700">{r.id_curso}</Text>
                </View>
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
        key={chip.label}
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentCurso, setCurrentCurso] = useState(null);
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
                placeholder="Buscar por ID, nombre o precio"
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
    });
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
    const { data, error } = await supabase
      .from("estudiantes")
      .select("*")
      .gt("monto_pendiente", 0) // gt = greater than
      .order("monto_pendiente", { ascending: false });

    if (!error && data) setEstudiantesConAdeudo(data);
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
    <View className="flex-1 bg-slate-50 relative">
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
                placeholder="Buscar por nombre, curso..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="ml-2 text-base"
              />
            </View>
            <View className="flex-row">
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
          </View>

          <TablaVentasPendientes
            data={estudiantesConAdeudo}
            query={searchTerm}
            isRefetching={isRefetching}
            onRefresh={handleRefresh}
            onEdit={(est) => console.log("Edit", est)}
            onReprint={(id) => console.log("Reprinting ticket for", id)}
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
    </View>
  );
};

const SeccionReportes = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [salesData, setSalesData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const years = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { label: String(y), value: y };
  });

  const fetchData = async (selectedYear) => {
    setLoading(true);
    const startDate = `${selectedYear}-01-01`;
    const endDate = `${selectedYear}-12-31`;

    // 1. Fetch Sales
    // const { data: sales, error: salesError } = await supabase
    //   .from("ventas")
    //   .select("fecha_venta, monto_final")
    //   .gte("fecha_venta", startDate)
    //   .lte("fecha_venta", endDate);

    // if (salesError) console.error("Error fetching sales:", salesError);

    // 2. Fetch Students
    // const { data: students, error: studentsError } = await supabase
    //   .from("estudiantes")
    //   .select("created_at")
    //   .gte("created_at", startDate)
    //   .lte("created_at", endDate);

    // if (studentsError) console.error("Error fetching students:", studentsError);

    // 3. Process data
    const monthsTemplate = Array.from({ length: 12 }, (_, i) => ({
      value: 0,
      label: new Date(0, i).toLocaleString("es-MX", { month: "short" }),
    }));

    const monthlySales = JSON.parse(JSON.stringify(monthsTemplate));
    sales?.forEach((sale) => {
      const month = new Date(sale.fecha_venta).getMonth();
      monthlySales[month].value += sale.monto_final;
    });

    const monthlyStudents = JSON.parse(JSON.stringify(monthsTemplate));
    // students?.forEach((student) => {
    //   const month = new Date(student.created_at).getMonth();
    //   monthlyStudents[month].value += 1;
    // });

    setSalesData(monthlySales);
    setStudentsData(monthlyStudents);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(year);
  }, [year]);

  const totalSales = useMemo(
    () => salesData.reduce((sum, item) => sum + item.value, 0),
    [salesData]
  );
  const totalStudents = useMemo(
    () => studentsData.reduce((sum, item) => sum + item.value, 0),
    [studentsData]
  );

  const ChartCard = ({ title, total, data, unit = "" }) => (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex-1 min-w-[300px]">
      <View className="flex-row justify-between items-baseline mb-4">
        <Text className="text-lg font-bold text-slate-800">{title}</Text>
        <Text className="text-xl font-extrabold text-indigo-600">
          {unit === "$"
            ? currencyFormatter.format(total)
            : `${total} ${title.toLowerCase()}`}
        </Text>
      </View>
      {loading ? (
        <View className="h-60 justify-center items-center">
          <ActivityIndicator color="#6F09EA" />
        </View>
      ) : (
        <BarChart
          data={data}
          barWidth={20}
          spacing={15}
          roundedTop
          hideRules
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{ color: "#9ca3af" }}
          noOfSections={4}
          frontColor={"#6F09EA"}
          showGradient
          gradientColor={"#a78bfa"}
          barStyle={{
            shadowColor: "#6F09EA",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 5,
          }}
        />
      )}
    </View>
  );

  return (
    <ScrollView className={`flex-1 p-4 bg-slate-50`}>
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-slate-800">Reporte Anual</Text>
        <View className="w-40">
          <Dropdown
            style={styles.dropdownIngresos}
            data={years}
            labelField="label"
            valueField="value"
            value={year}
            onChange={(item) => setYear(item.value)}
          />
        </View>
      </View>

      <View
        className={`flex-1 flex-wrap justify-center items-center flex-row gap-6`}
      >
        <ChartCard
          title="Ventas"
          total={totalSales}
          data={salesData}
          unit="$"
        />
        <ChartCard title="Alumnos" total={totalStudents} data={studentsData} />
      </View>
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
      // El ancho base es el del primer botón (Catálogo)
      const baseWidth = catalogoLayout.width;
      // El factor de escala es el ancho del botón destino dividido por el ancho base
      const scaleFactor = targetLayout.width / baseWidth;

      Animated.spring(slideAnim, {
        toValue: targetLayout.x,
        useNativeDriver: true, // Volvemos a usar el driver nativo para fluidez
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
          // Aparece
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(800),
        Animated.timing(hintAnim, {
          // Desaparece
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);
      sequence.start();
      // Limpia la animación si el usuario sale de la pantalla antes de que termine
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
    <View className={`flex-1 bg-slate-50`}>
      <View className={`items-center flex-row justify-center p-2`}>
        <View
          className={`p-1 justify-center items-center flex-row relative bg-gray-300 rounded-lg gap-x-2`}
        >
          {catalogoLayout && tarifarioLayout && (
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                top: 3.2,
                width: catalogoLayout?.width || 0, // Ancho base
                height: "100%",
                backgroundColor: "white",
                borderRadius: 5,
                elevation: 3,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 2 },
                transform: [{ translateX: slideAnim }, { scaleX: scaleAnim }],
                transformOrigin: "left", // Asegura que la escala se aplique desde la izquierda
              }}
            />
          )}
          <Pressable
            onLayout={(e) => setCatalogoLayout(e.nativeEvent.layout)}
            className={`p-2 justify-center items-center rounded`}
            onPress={() => setCatalogos(false)}
          >
            <Text
              className={`uppercase font-semibold ${!catalogos ? "text-slate-800" : "text-slate-600"}`}
            >
              Catálogo
            </Text>
            <Svg
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill={!catalogos ? "#010101" : "#64748b"}
            >
              <Path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z" />
            </Svg>
          </Pressable>
          <Pressable
            onLayout={(e) => setTarifarioLayout(e.nativeEvent.layout)}
            className={`p-2 justify-center items-center rounded`}
            onPress={() => setCatalogos(true)}
          >
            <Text
              className={`uppercase font-semibold ${catalogos ? "text-slate-800" : "text-slate-600"}`}
            >
              Tarifario
            </Text>
            <Svg
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill={catalogos ? "#010101" : "#64748b"}
            >
              <Path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" />
            </Svg>
          </Pressable>
        </View>
      </View>

      <Tab.Navigator
        key={catalogos ? "tarifario" : "catalogo"} // Clave para forzar el reseteo del estado del navegador
        tabBarPosition="bottom"
        tabBar={(props) => <MinimalistTabBar {...props} />}
      >
        {imagesToShow.map((imageSource, index) => (
          <Tab.Screen
            className={`bg-slate-50`}
            key={index}
            name={`Página ${index + 1}`}
          >
            {() => (
              <Pressable
                onPress={handleDoubleTap}
                style={styles.carouselContainer}
              >
                <Image
                  source={imageSource}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
              </Pressable>
            )}
          </Tab.Screen>
        ))}
      </Tab.Navigator>

      {/* Hint animado para el doble toque */}
      <Animated.View
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: [
            { translateX: -100 }, // Mitad del ancho aprox.
            { translateY: -30 }, // Mitad del alto aprox.
            { scale: hintAnim },
          ],
          opacity: hintAnim,
        }}
        className="bg-black/70 rounded-full p-4 flex-row items-center gap-x-3"
        pointerEvents="none"
      >
        <Svg height="24" viewBox="0 0 24 24" width="24" fill="white">
          <Path d="M18.5 10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S17 8.17 17 9s.67 1.5 1.5 1.5zm-5 0c.83 0 1.5-.67 1.5-1.5S14.33 7.5 13.5 7.5 12 8.17 12 9s.67 1.5 1.5 1.5zm-5 0c.83 0 1.5-.67 1.5-1.5S9.33 7.5 8.5 7.5 7 8.17 7 9s.67 1.5 1.5 1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </Svg>
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
