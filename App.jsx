import "react-native-gesture-handler";
import {
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
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
  Alert,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import "./global.css";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Svg, { Path } from "react-native-svg";
import { Table, Row, TableWrapper, Cell } from "react-native-table-component";
import Ripple from "react-native-material-ripple";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
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

const Tab = createMaterialTopTabNavigator(); //Aqui se esta creando el componente
const Drawer = createDrawerNavigator();

export default function App() {
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
    Asesores: "Panel Administrativo",
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
  return (
    <Tab.Navigator
      initialRouteName="Venta"
      tabBarPosition="top"
      screenOptions={{
        tabBarActiveTintColor: "#1f1f1f",
        tabBarInactiveTintColor: "#70757a",

        tabBarScrollEnabled: true,
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
      <Tab.Screen name="Venta" component={SeccionVentas} />
      <Tab.Screen name="Reporte" component={SeccionReportes} />
      <Tab.Screen name="Catálogos">
        {() => (
          <SeccionCatalogos catalogos={catalogos} setCatalogos={setCatalogos} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const ScreenEstudiantes = () => {
  const tableDataEstudiantes = [
    [
      1,
      "Juan Pérez",
      "Curso de React Native",
      "$500",
      "10",
      "Grupo A",
      "$1500",
    ],
    [2, "María López", "Asesoría Personal", "$0", "5", "Grupo B", "$2000"],
    [2, "María López", "Asesoría Personal", "$0", "5", "Grupo B", "$2000"],
    [2, "María López", "Asesoría Personal", "$0", "5", "Grupo B", "$2000"],
    [2, "María López", "Asesoría Personal", "$0", "5", "Grupo B", "$2000"],
    [2, "María López", "Asesoría Personal", "$0", "5", "Grupo B", "$2000"],
    [2, "María López", "Asesoría Personal", "$0", "5", "Grupo B", "$2000"],
    [2, "María López", "Asesoría Personal", "$0", "5", "Grupo B", "$2000"],
  ];
  return (
    <View
      id="screen-estudiantes"
      className={`flex-1 bg-slate-50 justify-center items-center vertical:px-2`}
    >
      <View className={`mt-4`}>
        <ScrollView horizontal>
          <Table style={{ borderRadius: 10 }}>
            <Row
              data={[
                "#",
                "Nombre del cliente",
                "Curso/Asesoría",
                "Pendiente",
                "Sesiones",
                "Grupo",
                "Ingreso",
              ]}
              height={40}
              widthArr={[100, 150, 200, 120, 100, 100, 120]}
              className="flex items-center justify-center"
              textStyle={{
                textAlign: "center", // Estilo para el texto de la cabecera
                fontWeight: "bold",
              }}
              style={{
                backgroundColor: "#eef2f5",
                borderWidth: 1,
                borderColor: "#e2e4e8",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            />
            <ScrollView horizontal={false} nestedScrollEnabled={true}>
              {tableDataEstudiantes.map((rowData, index) => (
                <TableWrapper
                  key={index}
                  style={{
                    flexDirection: "row",
                    borderWidth: 1,
                    borderColor: "#e2e4e8",
                    paddingVertical: 10,
                  }}
                >
                  <Cell
                    data={index + 1}
                    width={100}
                    textStyle={styles.tableText}
                  />
                  <Cell
                    style={{ textAlign: "start" }}
                    data={rowData[1]}
                    width={150}
                    textStyle={styles.tableText}
                  />
                  <Cell
                    data={rowData[2]}
                    width={200}
                    textStyle={styles.tableText}
                  />
                  <Cell
                    data={rowData[3]}
                    width={120}
                    textStyle={styles.tableText}
                  />
                  <Cell
                    data={rowData[4]}
                    width={100}
                    textStyle={styles.tableText}
                  />
                  <Cell
                    data={rowData[5]}
                    width={100}
                    textStyle={styles.tableText}
                  />
                  <Cell
                    data={rowData[6]}
                    width={120}
                    textStyle={styles.tableText}
                  />
                </TableWrapper>
              ))}
            </ScrollView>
          </Table>
        </ScrollView>
      </View>
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
        setLoading(true);
        const { data, error } = await supabase
          .from("asesores")
          .select("*")
          .order("id_asesor", { ascending: false });
        if (!error && data) {
          setAsesores(data);
          // Si no hay asesores, mostramos el formulario directamente
          if (data.length === 0) {
            setViewMode("form");
          } else {
            setViewMode("list");
          }
        }
        setLoading(false);
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

  // Cambiamos a la vista de formulario para agregar uno nuevo
  const handleAdd = () => {
    setEditingAsesor(null); // Nos aseguramos de que no haya datos de edición
    setViewMode("form");
  };

  // Si estamos en modo formulario, renderizamos RegistroAsesor
  if (viewMode === "form") {
    return (
      <RegistroAsesor
        asesorToEdit={editingAsesor}
        onFormClose={() => setViewMode("list")} // Para volver a la tabla
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
}) => {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((r) => {
      if (!q) return true;
      return (
        String(r.nombre_asesor).toLowerCase().includes(q) ||
        String(r.correo_asesor).toLowerCase().includes(q) ||
        String(r.telefono_asesor).toLowerCase().includes(q)
      );
    });
  }, [data, query]);

  return (
    <ScrollView
      className="px-2"
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
          <Text className="p-3 font-bold text-slate-600 w-1/4">Nombre</Text>
          <Text className="p-3 font-bold text-slate-600 w-1/4">Correo</Text>
          <Text className="p-3 font-bold text-slate-600 w-1/4">Teléfono</Text>
          <Text className="p-3 font-bold text-slate-600 w-1/4 text-center">
            Acciones
          </Text>
        </View>
        {/* Filas */}
        {filtered.map((asesor, index) => (
          <View
            key={asesor.id_asesor}
            className={`flex-row items-center border-t border-slate-200 ${index % 2 ? "bg-white" : "bg-slate-50"}`}
          >
            <Text className="p-3 text-slate-800 w-1/4" numberOfLines={1}>
              {asesor.nombre_asesor}
            </Text>
            <Text className="p-3 text-slate-700 w-1/4" numberOfLines={1}>
              {asesor.correo_asesor}
            </Text>
            <Text className="p-3 text-slate-700 w-1/4">
              {asesor.telefono_asesor}
            </Text>
            <View className="p-3 w-1/4 flex-row justify-center items-center gap-x-6">
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
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const ScreenPagos = () => {
  const [copiado, setCopiado] = useState(false); //Esta es la funcion que necesito modificar

  const copiarDatos = async (e) => {
    await Clipboard.setStringAsync(e);
    setCopiado(true);
    setTimeout(() => {
      setCopiado(false);
    }, 1500);
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

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
                  <Ripple className={`bg-blue-500 p-2 rounded`}>
                    <Text className={`text-center text-white`}>
                      Ir a la seccion de registro
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

const Proximamente = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View className={`flex-1 justify-center items-center flex-row`}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#334155" }}>
        Próximamente
      </Text>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#334155",
          width: 20,
          textAlign: "left",
        }}
      >
        {dots}
      </Text>
    </View>
  );
};

const ScreenFinanzas = () => {
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

  const initialFormState = {
    // Estado para la fila de nuevo ingreso
    id: null,
    alumno: "",
    curso: "",
    fechaInicio: "",
    asesor: null,
    metodoPago: null,
    importe: "",
    estatus: null,
  };

  const [isFormModalVisible, setFormModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [currentIngreso, setCurrentIngreso] = useState(initialFormState);

  const [formErrors, setFormErrors] = useState({
    alumno: false,
    curso: false,
    fechaInicio: false,
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAllYear, setShowAllYear] = useState(false);

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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    label: (currentYear - i).toString(),
    value: currentYear - i,
  }));

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

  const handleOpenModal = (mode, rowData = null) => {
    setModalMode(mode);
    if (mode === "edit" && rowData) {
      setCurrentIngreso({ ...rowData, importe: rowData.importe.toString() });
    } else {
      setCurrentIngreso(initialFormState);
    }
    setFormModalVisible(true);
  };

  const handleCloseModal = () => {
    setFormModalVisible(false);
    setCurrentIngreso(initialFormState);
    setFormErrors({ alumno: false, curso: false, fechaInicio: false }); // Resetear errores al cerrar
  };

  const handleSave = () => {
    const { alumno, curso, fechaInicio } = currentIngreso;
    // Validaciones
    if (!alumno || !curso || !fechaInicio) {
      setFormErrors({
        alumno: !alumno,
        curso: !curso,
        fechaInicio: !fechaInicio,
      });
      return;
    }

    if (modalMode === "add") {
      // Crear nueva entrada
      const newEntry = {
        ...currentIngreso,
        id:
          ingresosData.length > 0
            ? Math.max(...ingresosData.map((i) => i.id)) + 1
            : 1,
        importe: parseFloat(currentIngreso.importe) || 0,
      };
      setIngresosData([...ingresosData, newEntry]);
    } else {
      // Actualizar entrada existente
      const updatedData = ingresosData.map((row) => {
        if (row.id === currentIngreso.id) {
          return {
            ...currentIngreso,
            importe: parseFloat(currentIngreso.importe) || 0,
          };
        }
        return row;
      });
      setIngresosData(updatedData);
    }

    handleCloseModal();
  };

  const handleInputChange = (field, value) => {
    setCurrentIngreso({ ...currentIngreso, [field]: value });
    // Si hay un error en el campo que se está modificando, se limpia
    if (formErrors[field]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [field]: false,
      }));
    }
  };

  const filteredIngresos = ingresosData.filter((ingreso) => {
    // Asegurarse de que la fecha de inicio no esté vacía
    if (!ingreso.fechaInicio) return false;
    const ingresoDate = new Date(ingreso.fechaInicio);
    if (showAllYear) {
      return ingresoDate.getFullYear() === selectedYear;
    }
    return (
      ingresoDate.getMonth() === selectedMonth &&
      ingresoDate.getFullYear() === selectedYear
    );
  });
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
            <TouchableOpacity onPress={() => handleOpenModal("edit", data)}>
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
    <Tab.Navigator
      initialRouteName="Ingresos"
      tabBarPosition="top"
      screenOptions={{
        tabBarActiveTintColor: "#1f1f1f",
        tabBarInactiveTintColor: "#70757a",
        swipeEnabled: false,

        tabBarScrollEnabled: true,
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
      <Tab.Screen name="Ingresos">
        {() => (
          <View id="tablas-ingresos" className={`flex-1 bg-slate-50 p-4`}>
            <View className="flex-row mb-4 items-center gap-x-4">
              <View>
                <Text style={styles.label}>Mes</Text>
                <Dropdown
                  style={[
                    styles.dropdownIngresos,
                    showAllYear && styles.dropdownDisabled,
                  ]}
                  data={months}
                  disable={showAllYear}
                  labelField="label"
                  valueField="value"
                  value={selectedMonth}
                  onChange={(item) => {
                    setSelectedMonth(item.value);
                  }}
                />
              </View>
              <View>
                <Text style={styles.label}>Año</Text>
                <Dropdown
                  style={styles.dropdownIngresos}
                  data={years}
                  labelField="label"
                  valueField="value"
                  value={selectedYear}
                  onChange={(item) => setSelectedYear(item.value)}
                />
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => setShowAllYear(!showAllYear)}
                  className={`h-6 w-6 rounded border-2 justify-center items-center ${
                    showAllYear
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {showAllYear && (
                    <Svg
                      height="16"
                      viewBox="0 -960 960 960"
                      width="16"
                      fill="#ffffff"
                    >
                      <Path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </Svg>
                  )}
                </TouchableOpacity>
                <Text
                  className="ml-2 font-medium text-slate-700"
                  onPress={() => setShowAllYear(!showAllYear)}
                >
                  Ver todo el año
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleOpenModal("add")}
              className="bg-blue-500 p-3 rounded-lg self-start mb-4 shadow-md"
            >
              <View className="flex-row items-center gap-x-2">
                <Svg
                  height="20"
                  viewBox="0 -960 960 960"
                  width="20"
                  fill="#ffffff"
                >
                  <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </Svg>
                <Text className="text-white font-bold">Agregar Ingreso</Text>
              </View>
            </TouchableOpacity>
            <ScrollView horizontal>
              <View>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#e2e4e8" }}>
                  <Row
                    data={tableHeaders.map((h) => h.title)}
                    widthArr={tableHeaders.map((h) => h.width)}
                    style={styles.head}
                    textStyle={styles.headText}
                  />
                </Table>
                <ScrollView nestedScrollEnabled={true}>
                  <Table
                    borderStyle={{ borderWidth: 1, borderColor: "#e2e4e8" }}
                  >
                    {filteredIngresos.map((rowData, index) => (
                      <TableWrapper key={rowData.id} style={styles.row}>
                        {tableHeaders.map((cellInfo, cellIndex) => (
                          <Cell
                            key={cellIndex}
                            data={renderCell(rowData, cellInfo, index)}
                            width={cellInfo.width}
                            style={{ padding: 6 }}
                          />
                        ))}
                      </TableWrapper>
                    ))}
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
            <Modal
              transparent={true}
              animationType="slide"
              visible={isFormModalVisible}
              onRequestClose={handleCloseModal}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-center items-center fixed bg-black/60 p-4">
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="bg-slate-50 rounded-2xl p-6 w-full shadow-xl">
                      <Text className="text-2xl font-bold mb-6 text-slate-800">
                        {modalMode === "add"
                          ? "Agregar Ingreso"
                          : "Editar Ingreso"}
                      </Text>
                      <ScrollView>
                        {/* Nombre del Alumno */}
                        <View className={`flex-row gap-x-4`}>
                          <View className={`flex-1`}>
                            <Text style={styles.label}>Nombre</Text>
                            <TextInput
                              style={[
                                styles.input,
                                formErrors.alumno && styles.errorInput,
                              ]}
                              value={currentIngreso.alumno}
                              onChangeText={(text) =>
                                handleInputChange("alumno", text)
                              }
                              placeholder={
                                formErrors.alumno ? "" : "Ej. Juan Pérez"
                              }
                              placeholderTextColor={
                                formErrors.alumno ? "#ef4444" : "#9ca3af"
                              }
                            />
                          </View>

                          {/* Curso/Asesoría */}
                          <View className={`flex-1`}>
                            <Text style={styles.label}>Curso/Asesoría</Text>
                            <Dropdown
                              className={``}
                              style={[
                                styles.dropdownModal,
                                formErrors.curso && styles.errorInput,
                              ]}
                              data={cursos}
                              labelField="label"
                              valueField="value"
                              placeholder={
                                formErrors.curso ? "" : "Seleccionar curso"
                              }
                              placeholderStyle={
                                formErrors.curso && { color: "#ef4444" }
                              }
                              value={currentIngreso.curso}
                              onChange={(item) =>
                                handleInputChange("curso", item.value)
                              }
                            />
                          </View>
                        </View>

                        <View className={`flex-row gap-x-4`}>
                          {/* Fecha de Inicio */}
                          <View className={`flex-1`}>
                            <Text style={styles.label}>Fecha de Inicio</Text>
                            <TouchableOpacity
                              onPress={() => setCalendarVisible(true)}
                              style={[
                                styles.input,
                                formErrors.fechaInicio && styles.errorInput,
                              ]}
                            >
                              <Text
                                className={
                                  currentIngreso.fechaInicio
                                    ? "text-black"
                                    : "text-gray-400"
                                }
                                style={
                                  formErrors.fechaInicio && { color: "#ef4444" }
                                }
                              >
                                {currentIngreso.fechaInicio ||
                                  (formErrors.fechaInicio
                                    ? "Fecha inválida"
                                    : "Seleccionar fecha")}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          {/* Asesor */}
                          <View className={`flex-1`}>
                            <Text style={styles.label}>Asesor</Text>
                            <Dropdown
                              style={styles.dropdownModal}
                              data={asesores}
                              labelField="label"
                              valueField="value"
                              placeholder="Seleccionar asesor"
                              value={currentIngreso.asesor}
                              onChange={(item) =>
                                handleInputChange("asesor", item.value)
                              }
                            />
                          </View>
                        </View>

                        {/* Método de Pago */}
                        <Text style={styles.label}>Método de Pago</Text>
                        <Dropdown
                          style={styles.dropdownModal}
                          data={metodosPago}
                          labelField="label"
                          valueField="value"
                          placeholder="Seleccionar método"
                          value={currentIngreso.metodoPago}
                          onChange={(item) =>
                            handleInputChange("metodoPago", item.value)
                          }
                        />

                        {/* Importe */}
                        <Text style={styles.label}>Importe</Text>
                        <View
                          style={styles.input}
                          className="flex-row items-center"
                        >
                          <Text className="mr-1">$</Text>
                          <TextInput
                            value={currentIngreso.importe.toString()}
                            onChangeText={(text) => {
                              const numericValue = text.replace(/[^0-9.]/g, "");
                              handleInputChange("importe", numericValue);
                            }}
                            placeholder="0.00"
                            keyboardType="numeric"
                            className="flex-1"
                          />
                        </View>

                        {/* Estatus */}
                        <Text style={styles_modal.label}>Estatus</Text>
                        <Dropdown
                          style={styles.dropdownModal}
                          data={estatusOptions}
                          labelField="label"
                          valueField="value"
                          placeholder="Seleccionar estatus"
                          value={currentIngreso.estatus}
                          onChange={(item) =>
                            handleInputChange("estatus", item.value)
                          }
                        />
                      </ScrollView>
                      {/* Botones */}
                      <View className="flex-row justify-end mt-6 gap-x-4">
                        <TouchableOpacity
                          onPress={handleCloseModal}
                          className="bg-slate-200 px-5 py-3 rounded-lg"
                        >
                          <Text className="font-bold text-slate-600">
                            Cancelar
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleSave}
                          className="bg-indigo-600 px-5 py-3 rounded-lg shadow-md shadow-indigo-600/30"
                        >
                          <Text className="text-white font-bold">Guardar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              transparent={true}
              animationType="fade"
              visible={isCalendarVisible}
              onRequestClose={() => setCalendarVisible(false)}
            >
              <TouchableWithoutFeedback
                onPress={() => setCalendarVisible(false)}
              >
                <View className="flex-1 justify-center items-center bg-black/50">
                  <TouchableWithoutFeedback>
                    <View className="bg-white rounded-lg p-5">
                      <Calendar
                        onDayPress={(day) => {
                          handleInputChange("fechaInicio", day.dateString);
                          setCalendarVisible(false);
                        }}
                        markedDates={{
                          [currentIngreso.fechaInicio]: {
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
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen name="Egresos" id="tablas-egresos">
        {() => <View className={`flex-1 bg-slate-50 p-2`}></View>}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const ScreenCalendario = () => {
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

  return (
    <View className={`flex-1 bg-slate-50 p-2 flex-col`}>
      <View
        className={`flex-1 horizontal:flex-row vertical:flex-col p-2 vertical:gap-y-10 horizontal:gap-x-10`}
      >
        <View
          className={`horizontal:flex-col vertical:flex-col vertical:items-center horizontal:items-stretch `}
        >
          <Calendar
            showSixWeeks={true}
            pastScrollRange={1} // Limita a 1 mes en el pasado
            futureScrollRange={1} // Limita a 1 mes en el futuro
            enableSwipeMonths={true}
            disabledByWeekDays={[0]}
            disableAllTouchEventsForDisabledDays={true}
            style={{
              width: 400,
              borderRadius: 10,
              borderColor: "#1f1f1f",
              borderWidth: 1,
              boxSizing: "border-box",
              backgroundColor: "#f8fafc",
            }}
            theme={{
              calendarBackground: "#f8fafc",
            }}
            renderArrow={(direction) => {
              if (direction === "left") {
                return (
                  <View
                    style={{
                      backgroundColor: "#B58EE2",
                      // --- Sombra para los botones de flecha ---
                      elevation: 4, // Sombra para Android
                      shadowColor: "#000", // Sombra para iOS
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    }}
                    className={`rounded-full p-1`}
                  >
                    <Svg
                      height="24"
                      viewBox="0 -960 960 960"
                      width="24"
                      fill="#ffffff"
                    >
                      <Path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
                    </Svg>
                  </View>
                );
              } else {
                return (
                  <View
                    style={{
                      backgroundColor: "#B58EE2",
                      // --- Sombra para los botones de flecha ---
                      elevation: 4, // Sombra para Android
                      shadowColor: "#000", // Sombra para iOS
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    }}
                    className={`rounded-full p-1`}
                  >
                    <Svg
                      height="24"
                      viewBox="0 -960 960 960"
                      width="24"
                      fill="#ffffff"
                    >
                      <Path d="M400-240 344-296l184-184-184-184 56-56 240 240-240 240Z" />
                    </Svg>
                  </View>
                );
              }
            }}
          />
        </View>
        <View
          className={`flex-1 vertical:flex-row horizontal:flex-col vertical:gap-x-4 horizontal:gap-x-0`}
        >
          <View className={`flex-1`}>
            <Text className={`uppercase font-bold border-b `}>
              Próximos eventos
            </Text>
            <View className={`flex-1 items-center justify-center`}>
              <Text>¡Vaya!, al parecer no quedan pedientes</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
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
        className={`rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm ${Platform.OS=="web" ? "flex-1": ""}`}
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
            <SortHeader label="Acciones" k="Acciones" flex={0.2} />
          </View>

          {filtered.map((r, id_curso) => (
            <Pressable
              key={r.id_curso}
              className={`flex-row items-center ${id_curso % 2 ? "bg-white" : "bg-slate-50"}`}
              android_ripple={{ color: "rgba(0,0,0,0.04)" }}
            >
              <View style={{ flex: 0.1 }} className="py-3 px-3 items-center">
                <Text className="text-slate-700">{r.id_curso}</Text>
              </View>
              <View style={{ flex: 1 }} className="py-3 px-3">
                <Text numberOfLines={1} className="text-slate-800 font-medium">
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
                <View className="flex flex-row items-center justify-between">
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
          ))}
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

const ScreenCursos = () => {
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

  const handleCancelAdd = () => {
    // Revisa si el usuario ha escrito algo en el formulario
    const hasData =
      newCurso.nombre_curso.trim() !== "" || newCurso.costo_curso.trim() !== "";

    if (hasData) {
      Alert.alert(
        "¿Descartar curso?",
        "Si cancelas, los datos que ingresaste se perderán. ¿Estás seguro?",
        [
          { text: "Continuar editando", style: "cancel" },
          {
            text: "Sí, descartar",
            style: "destructive",
            onPress: () => setAddModalVisible(false), // Solo cierra si el usuario confirma
          },
        ]
      );
    } else {
      // Si el formulario está vacío, simplemente cierra el modal
      setAddModalVisible(false);
    }
  };

  const handleOpenAddModal = () => {
    setNewCurso({ nombre_curso: "", costo_curso: "" }); // Resetea el formulario
    setAddModalVisible(true);
  };
  const handleOpenEditModal = (curso) => {
    // Formateamos el costo al abrir el modal
    const formattedCost = new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 2,
    }).format(curso.costo_curso || 0);
    setCurrentCurso({ ...curso, costo_curso: formattedCost });
    setModalVisible(true);
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

  const handleSaveChanges = async () => {
    if (
      !currentCurso ||
      !currentCurso.nombre_curso ||
      !currentCurso.costo_curso
    ) {
      Alert.alert(
        "Campos incompletos",
        "Por favor, completa el nombre y el precio del curso."
      );
      return;
    }
    setIsSaving(true);
    const { error } = await supabase
      .from("cursos")
      .update({
        nombre_curso: currentCurso.nombre_curso,
        costo_curso: unformatCurrency(currentCurso.costo_curso),
      })
      .eq("id_curso", currentCurso.id_curso);

    setIsSaving(false);
    if (error) {
      Alert.alert("Error", "No se pudieron guardar los cambios.");
      console.error("Error updating course:", error);
    } else {
      // En lugar de solo actualizar el estado local, recargamos los datos.
      handleRefresh();
      setModalVisible(false);
      setCurrentCurso(null);
    }
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

    // ADVERTENCIA: No se recomienda calcular el ID en el frontend.
    // 1. Calcular el nuevo ID basándose en los datos actuales.
    const newId =
      cursos.length > 0 ? Math.max(...cursos.map((c) => c.id_curso)) + 1 : 1;

    // 2. Insertar el nuevo curso incluyendo el ID calculado.
    const { data, error } = await supabase
      .from("cursos")
      .insert({
        id_curso: newId, // Se envía el ID explícitamente
        nombre_curso: newCurso.nombre_curso,
        costo_curso: unformatCurrency(newCurso.costo_curso),
      })
      .select()
      .single();
    setIsSaving(false);
    if (error) {
      Alert.alert("Error", "No se pudo crear el curso.");
      console.error("Error creating course:", error);
    } else {
      // Actualizar la UI agregando el nuevo curso al estado local
      if (data) {
        // Añadimos el nuevo curso al principio de la lista. Es más eficiente que reordenar todo.
        setCursos((prevCursos) => [data, ...prevCursos]);
      }
      setAddModalVisible(false);
      setNewCurso({ nombre_curso: "", costo_curso: "" });
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS === "web" ? "" : Keyboard.dismiss}
      accessible={false}
    >
      <View className={`flex-1 pb-20 bg-slate-50`}>
        <View
          className={`self-center flex-row items-center gap-x-4 m-2 box-content mb-7`}
        >
          <View
            className={`border border-[#b5b8bb] justify-center items-center flex-row rounded-full`}
          >
            <View className="pl-3" pointerEvents="none">
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#b5b8bb"
              >
                <Path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </Svg>
            </View>
            <TextInput
              id="buscador-cursos"
              placeholder="Buscar por ID, nombre o precio"
              className={`py-2 px-2 pl-1 pr-4 min-w-[20em]`}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <TouchableOpacity
            onPress={handleOpenAddModal}
            className="bg-indigo-600 p-2 rounded-full shadow-md shadow-indigo-600/30 flex-row items-center px-4"
          >
            <Svg height="18" viewBox="0 -960 960 960" width="18" fill="#ffffff">
              <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </Svg>
            <Text className="text-white font-bold ml-2">Agregar Curso</Text>
          </TouchableOpacity>
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

        {/* --- Modal de Edición --- */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View className="flex-1 justify-center items-center bg-black/60 p-4">
              <TouchableWithoutFeedback>
                <View className="bg-slate-50 rounded-2xl p-6 w-full max-w-lg shadow-xl">
                  <Text className="text-2xl font-bold mb-6 text-slate-800">
                    Editar Curso
                  </Text>

                  <Text style={styles.label}>Nombre del Curso</Text>
                  <TextInput
                    style={styles.input}
                    value={currentCurso?.nombre_curso}
                    onChangeText={(text) =>
                      setCurrentCurso((c) => ({ ...c, nombre_curso: text }))
                    }
                    placeholder="Nombre del curso"
                  />

                  <Text style={styles.label}>Precio del Curso</Text>
                  <View style={styles.input} className="flex-row items-center">
                    <Text className="mr-1 text-slate-500">$</Text>
                    <TextInput
                      value={currentCurso?.costo_curso}
                      onChangeText={(text) => {
                        // Limita la entrada a 2 decimales
                        if (
                          text.includes(".") &&
                          text.split(".")[1].length > 2
                        ) {
                          return;
                        }
                        // Permite borrar y escribir normalmente
                        setCurrentCurso((c) => ({ ...c, costo_curso: text }));
                      }}
                      placeholder="0.00"
                      keyboardType="numeric"
                      className="flex-1"
                    />
                  </View>

                  <View className="flex-row justify-end mt-6 gap-x-4">
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      className="bg-slate-200 px-5 py-3 rounded-lg"
                    >
                      <Text className="font-bold text-slate-600">Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSaveChanges}
                      disabled={isSaving}
                      className={`px-5 py-3 rounded-lg ${isSaving ? "bg-indigo-400" : "bg-indigo-600 shadow-md shadow-indigo-600/30"}`}
                    >
                      {isSaving ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text className="text-white font-bold">
                          Guardar Cambios
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* --- Modal de AGREGAR --- */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={isAddModalVisible}
          onRequestClose={handleCancelAdd}
        >
          <TouchableWithoutFeedback onPress={handleCancelAdd}>
            <View className="flex-1 justify-center items-center bg-black/60 p-4">
              <TouchableWithoutFeedback>
                <View className="bg-slate-50 rounded-2xl p-6 w-full max-w-lg shadow-xl">
                  <Text className="text-2xl font-bold mb-6 text-slate-800">
                    Agregar Nuevo Curso
                  </Text>

                  <Text style={styles.label}>Nombre del Curso</Text>
                  <TextInput
                    style={styles.input}
                    value={newCurso.nombre_curso}
                    onChangeText={(text) =>
                      setNewCurso((c) => ({ ...c, nombre_curso: text }))
                    }
                    placeholder="Ej. Curso de Verano STEAM"
                  />

                  <Text style={styles.label}>Precio del Curso</Text>
                  <View style={styles.input} className="flex-row items-center">
                    <Text className="mr-1 text-slate-500">$</Text>
                    <TextInput
                      value={newCurso.costo_curso}
                      onChangeText={(text) => {
                        // Limita la entrada a 2 decimales
                        if (
                          text.includes(".") &&
                          text.split(".")[1].length > 2
                        ) {
                          return;
                        }
                        // Permite borrar y escribir normalmente
                        setNewCurso((c) => ({ ...c, costo_curso: text }));
                      }}
                      placeholder="Ej. 1200"
                      keyboardType="numeric"
                      className="flex-1"
                    />
                  </View>

                  <View className="flex-row justify-end mt-6 gap-x-4">
                    <TouchableOpacity
                      onPress={handleCancelAdd}
                      className="bg-slate-200 px-5 py-3 rounded-lg"
                    >
                      <Text className="font-bold text-slate-600">Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleAddCurso}
                      disabled={isSaving}
                      className={`px-5 py-3 rounded-lg ${isSaving ? "bg-indigo-400" : "bg-indigo-600 shadow-md shadow-indigo-600/30"}`}
                    >
                      {isSaving ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text className="text-white font-bold">
                          Guardar Curso
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const SeccionVentas = () => {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  const data = useMemo(
    () => [
      {
        id: 1,
        cliente: "Juan Pérez",
        concepto: "Curso de React Native",
        pendiente: 500,
        sesiones: 10,
        grupo: "Grupo A",
        ingreso: 1500,
      },
      {
        id: 2,
        cliente: "María López",
        concepto: "Asesoría Personal",
        pendiente: 0,
        sesiones: 5,
        grupo: "Grupo B",
        ingreso: 2000,
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = data.filter(
      (r) =>
        !q ||
        r.cliente.toLowerCase().includes(q) ||
        r.concepto.toLowerCase().includes(q) ||
        r.grupo.toLowerCase().includes(q)
    );
    const sorted = [...arr].sort((a, b) => {
      let va = a[sortKey];
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

  const ActionButton = ({ color = "#66b5ff", text, icon }) => (
    <Pressable
      className="rounded-xl px-3 py-2.5 flex-row items-center gap-2"
      style={{ backgroundColor: color, elevation: 5 }}
      android_ripple={{ color: "rgba(0,0,0,0.08)" }}
      hitSlop={8}
    >
      <Text className="text-[#0b0f19] font-semibold">{text}</Text>
      {icon}
    </Pressable>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View className="w-full flex-row flex-wrap items-center justify-between gap-2 p-2">
        <View className="flex-row items-center gap-2">
          <ActionButton
            text="Generar venta"
            icon={
              <Svg
                width={20}
                height={20}
                viewBox="0 -960 960 960"
                fill="#0b0f19"
              >
                <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
              </Svg>
            }
          />
          <ActionButton
            color="#facc15"
            text="Reimprimir ticket"
            icon={
              <Svg
                width={20}
                height={20}
                viewBox="0 -960 960 960"
                fill="#0b0f19"
              >
                <Path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z" />
              </Svg>
            }
          />
        </View>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
            <Svg width={18} height={18} viewBox="0 -960 960 960" fill="#64748b">
              <Path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </Svg>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar"
              placeholderTextColor="#94a3b8"
              className="min-w-[160px] sm:min-w-[240px] ml-2 text-slate-800"
            />
          </View>
        </View>
      </View>

      <View className="px-2 pb-4">
        <View className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <ScrollView stickyHeaderIndices={[0]}>
            <View className="bg-slate-100 border-b border-slate-200 flex-row">
              <SortHeader label="#" k="id" flex={0.8} center />
              <SortHeader label="Cliente" k="cliente" flex={2} />
              <SortHeader label="Curso/Asesoría" k="concepto" flex={2} />
              <SortHeader label="Pendiente" k="pendiente" flex={1} center />
              <SortHeader label="Sesiones" k="sesiones" flex={1} center />
              <SortHeader label="Grupo" k="grupo" flex={1.2} center />
              <SortHeader label="Ingreso" k="ingreso" flex={1.2} center />
            </View>

            {filtered.map((r, idx) => (
              <Pressable
                key={r.id}
                className={`flex-row items-center ${idx % 2 ? "bg-white" : "bg-slate-50"}`}
                android_ripple={{ color: "rgba(0,0,0,0.04)" }}
              >
                <View style={{ flex: 0.8 }} className="py-3 px-3 items-center">
                  <Text className="text-slate-700">{r.id}</Text>
                </View>
                <View style={{ flex: 2 }} className="py-3 px-3">
                  <Text
                    numberOfLines={1}
                    className="text-slate-800 font-medium"
                  >
                    {r.cliente}
                  </Text>
                </View>
                <View style={{ flex: 2 }} className="py-3 px-3">
                  <Text numberOfLines={1} className="text-slate-700">
                    {r.concepto}
                  </Text>
                </View>
                <View style={{ flex: 1 }} className="py-3 px-3 items-center">
                  <Text
                    className={`${r.pendiente > 0 ? "text-amber-700" : "text-emerald-700"} font-medium`}
                  >
                    {r.pendiente > 0 ? `$${r.pendiente}` : "$0"}
                  </Text>
                </View>
                <View style={{ flex: 1 }} className="py-3 px-3 items-center">
                  <Text className="text-slate-700">{r.sesiones}</Text>
                </View>
                <View style={{ flex: 1.2 }} className="py-3 px-3 items-center">
                  <Text className="text-slate-700" numberOfLines={1}>
                    {r.grupo}
                  </Text>
                </View>
                <View style={{ flex: 1.2 }} className="py-3 px-3 items-center">
                  <Text className="text-slate-900 font-semibold">
                    ${r.ingreso}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const SeccionReportes = () => {
  return (
    <View className={`flex-1 p-2 bg-slate-50`}>
      <Ripple
        id="boton-venta"
        rippleContainerBorderRadius={5}
        className={`rounded bg-[#66b5ff] max-w-[20em] justify-center items-center self-start p-1 flex flex-row gap-x-1`}
      >
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#010101"
        >
          <Path d="M280-280h80v-200h-80v200Zm320 0h80v-400h-80v400Zm-160 0h80v-120h-80v120Zm0-200h80v-80h-80v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
        </Svg>
        <Text className={`font-semibold`}>Generar reporte</Text>
      </Ripple>
      <View
        className={`flex-1 horizontal:justify-around items-center horizontal:flex-row vertical:flex-col`}
      >
        <View flex className={`gap-y-5`}>
          <Text className={`uppercase font-semibold text-center`}>ventas</Text>
          <BarChart
            className={``}
            roundedTop
            hideRules
            spacing={2}
            showGradient
            backgroundColor={`#F8FAFC`}
            frontColor={`#6F09EA`}
            gradientColor={`#A46CF5`}
            width={`39`}
            data={[
              { value: 250, label: "Ene" },
              { value: 500, label: "Feb" },
              { value: 745, label: "Mar" },
              { value: 320, label: "Abi" },
              { value: 600, label: "May" },
              { value: 256, label: "Jun" },
              { value: 300, label: "Jul" },
              { value: 250, label: "Ago" },
              { value: 500, label: "Sep" },
              { value: 745, label: "Oct" },
              { value: 320, label: "Nov" },
              { value: 600, label: "Dic" },
            ]}
          />
        </View>

        <View className={`gap-y-5`}>
          <Text className={`uppercase font-semibold text-center`}>alúmnos</Text>
          <BarChart
            className={``}
            roundedTop
            hideRules
            spacing={2}
            showGradient
            backgroundColor={`#F8FAFC`}
            frontColor={`#6F09EA`}
            gradientColor={`#A46CF5`}
            width={`39`}
            data={[
              { value: 250, label: "Ene" },
              { value: 500, label: "Feb" },
              { value: 745, label: "Mar" },
              { value: 320, label: "Abi" },
              { value: 600, label: "May" },
              { value: 256, label: "Jun" },
              { value: 300, label: "Jul" },
              { value: 250, label: "Ago" },
              { value: 500, label: "Sep" },
              { value: 745, label: "Oct" },
              { value: 320, label: "Nov" },
              { value: 600, label: "Dic" },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const SeccionCatalogos = ({ catalogos, setCatalogos }) => {
  const { width } = Dimensions.get("window");

  const lastTapTimeRef = useRef(null);

  const handleTap = () => {
    const now = new Date().getTime();
    const DOUBLE_TAP_DELAY = 300; // Adjust as needed for your use case (in milliseconds)

    if (now - lastTapTimeRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      console.log(catalogos ? "Catálogo" : "Tarifario");
      setCatalogos(!catalogos);
      // Perform 'like' action here
    } else {
      ("");
    }
    lastTapTimeRef.current = now;
  };

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
    require("./assets/Catalogo/Catalogo-15.png"),
    require("./assets/Catalogo/Catalogo-16.png"), // Ejemplo
  ];

  const tarifarioImages = [
    require("./assets/Tarifario/Tarifario-1.jpg"),
    require("./assets/Tarifario/Tarifario-2.jpg"),
    require("./assets/Tarifario/Tarifario-3.jpg"),
    require("./assets/Tarifario/Tarifario-4.jpg"),
    require("./assets/Tarifario/Tarifario-5.jpg"),
  ];

  const imagesToShow = catalogos ? tarifarioImages : catalogoImages;

  // const imagesToShow = catalogos ? tarifarioImages : catalogoImages;

  return (
    <View className={`flex-1 bg-slate-50`}>
      <View className={`items-center flex-row justify-center p-2`}>
        <View
          className={`p-2 justify-center items-center flex-row bg-gray-300 rounded gap-x-2`}
        >
          <View className={``}>
            <Ripple
              style={{ elevation: catalogos ? 0 : 5 }}
              rippleContainerBorderRadius={5}
              className={`self-start p-2 justify-center items-center rounded ${catalogos ? "" : "bg-white"}`}
              onPress={() => setCatalogos(false)}
            >
              <Text className={`uppercase font-semibold`}>Catálogo</Text>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#010101"
              >
                <Path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z" />
              </Svg>
            </Ripple>
          </View>
          <View>
            <Ripple
              style={{ elevation: catalogos ? 5 : 0 }}
              rippleContainerBorderRadius={5}
              className={`self-start p-2 justify-center items-center rounded ${catalogos ? "bg-white" : ""}`}
              onPress={() => setCatalogos(true)}
            >
              <Text className={`uppercase font-semibold`}>Tarifario</Text>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#010101"
              >
                <Path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" />
              </Svg>
            </Ripple>
          </View>
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
              <Pressable onPress={handleTap} style={styles.carouselContainer}>
                <Image
                  className={`bg-slate-50`}
                  source={imageSource}
                  style={{
                    width: width,
                    height: "100%",
                  }}
                  resizeMode="contain"
                />
              </Pressable>
            )}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
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
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
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
    height: 40,
    width: 150,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
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
});

const styles_modal = StyleSheet.create({ ...styles });
