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
} from "react-native";
import * as Clipboard from "expo-clipboard";
import "./global.css";
import { useState, useRef, useEffect } from "react";
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

import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import TopBar from "./components/topbar.jsx";
import MapView, { Marker } from "react-native-maps";

const Tab = createMaterialTopTabNavigator(); //Aqui se esta creando el componente
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          backgroundColor: "#6F09EA",
          background:
            "linear-gradient(90deg,rgba(111, 9, 234, 1) 0%, rgba(112, 9, 232, 1) 100%)",
        }}
        className={`flex-1 flex-col w-full`}
      >
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
              header: (props) => <TopBar {...props} />, // Usamos tu TopBar como header
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
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
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
            // Aquí va tu lógica para cerrar sesión
            alert("Cerrando sesión...");
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
  return <Text>Pantalla para estudiantes</Text>;
};

const ScreenAsesores = () => {
  return <Text>Pantalla para asesores</Text>;
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
                  {Platform.OS === "web" ? (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d237.04951234566224!2d-96.1219307!3d18.0811722!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c3e79a1075bcad%3A0x54b80ec3131030de!2sMQerKAcademy!5e0!3m2!1ses!2smx!4v1758650715785!5m2!1ses!2smx"
                      width="600"
                      height="450"
                    ></iframe>
                  ) : (
                    <MapView
                      style={{ width: 600, height: 450 }}
                      initialRegion={{
                        latitude: 18.08122029158371, // coordenadas de tu iframe
                        longitude: -96.12200652058925,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: 18.08122029158371,
                          longitude: -96.12200652058925,
                        }}
                        title="MQerKAcademy"
                        description="Ubicación exacta de la academia"
                      />
                    </MapView>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </Tab.Screen>
      <Tab.Screen name="Tarjeta de crédito / débito">
        {() => <Proximamente />}
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
  return <Text>Pantalla para finanzas</Text>;
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

  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 3);
  // Formato YYYY-MM-DD
  const minDate = sixMonthsAgo.toISOString().split("T")[0];
  const maxDate = `${today.getFullYear() + 1}-12-31`;
  const todayDateString = today.toISOString().split("T")[0];

  // Objeto para marcar la fecha de hoy con estilos personalizados
  const marked = {
    [todayDateString]: { selected: true, selectedColor: "#6F09EA" },
  };

  return (
    <View className={`flex-1 bg-slate-50 p-2 flex-col`}>
      <View
        className={`flex-1 horizontal:flex-row vertical:flex-col p-2 vertical:gap-y-10 horizontal:gap-x-10`}
      >
        <View
          className={`horizontal:flex-col vertical:flex-col vertical:items-center horizontal:items-stretch`}
        >
          <Calendar
            showSixWeeks={true}
            markingType={"custom"}
            markedDates={marked}
            minDate={minDate}
            maxDate={maxDate}
            futureScrollRange={12}
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
              textSectionTitleColor: "#1f1f1f",
              // Ya no necesitamos todayBackgroundColor o todayTextColor
              // porque lo manejamos con markedDates
              "stylesheet.day.basic": {
                selected: {
                  backgroundColor: "#6F09EA", // Color de fondo que ya tenías
                  borderRadius: 16,
                  // --- Aquí agregamos la sombra ---
                  elevation: 5, // Sombra para Android
                  shadowColor: "#000", // Sombra para iOS
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                },
                todayText: {
                  color: "#6F09EA", // Color para el número del día de hoy cuando no está seleccionado
                  fontWeight: "bold",
                },
              },
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
          <View
            className={`vertical:mt-4 horizontal:mt-4 vertical:items-center horizontal:items-center`}
          >
            <View
              className={`border p-1 rounded-full vertical:self-center horizontal:self-center shadow-md shadow-black bg-slate-400`}
            >
              <View className={`flex-row items-center gap-x-2`}>
                <Pressable
                  className={`p-3 shadow-md shadow-black bg-[#6F09EA] border border-white self-center rounded-full`}
                />
                <Text>Hoy</Text>
              </View>
            </View>
          </View>
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

const ScreenCursos = () => {
  const data = [
    { label: "Nombre", value: "1" },
    { label: "Precio", value: "2" },
    { label: "ID", value: "3" },
  ];
  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      className={`flex-1 bg-slate-50`}
    >
      <View className={`self-center p-2`}>
        <View
          className={`border justify-center items-center flex-row rounded-lg`}
        >
          <TextInput
            placeholder="Ingrese el curso que desee buscar"
            className={`self-start`}
          />
          <View className={`min-w-[15em] h-full relative bg-yellow-500`}>
            <Text>Buscar por</Text>
            <Dropdown
              className={`mt-5`}
              valueField={"value"}
              labelField={"label"}
              data={data}
              value={data[0]}
            />
          </View>
        </View>
        <Text>ddcd</Text>
        <Dropdown
          placeholder="Buscar por:"
          valueField={"value"}
          labelField={"label"}
          searchPlaceholder="dfsdfr"
          data={data}
        />
      </View>
    </ScrollView>
  );
};

const SeccionVentas = () => {
  const tableData = [
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
  ];

  return (
    <>
      <View className={`w-full flex flex-row items-center justify-between p-2`}>
        <Ripple
          id="boton-venta"
          rippleContainerBorderRadius={5}
          className={`rounded bg-[#66b5ff] max-w-[20em] justify-center items-center self-start p-1 flex flex-row gap-x-1`}
        >
          <Text
            className={`text-[#010101] capitalize text-nowrap font-semibold text-sm text-center`}
          >
            Generar venta
          </Text>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#010101"
          >
            <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </Svg>
        </Ripple>
        <Ripple
          rippleContainerBorderRadius={5}
          id="reimprimir-ticket"
          className={`rounded bg-yellow-400 max-w-[20em] justify-center items-center self-start p-1 flex flex-row gap-x-2`}
        >
          <Text
            className={`text-[#010101] capitalize text-nowrap font-semibold text-sm text-center`}
          >
            Reimprimir ticket
          </Text>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#010101"
          >
            <Path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z" />
          </Svg>
        </Ripple>
      </View>
      <View className={`relative py-20`}>
        <Ripple
          rippleContainerBorderRadius={100}
          className="absolute bottom-0 right-2 z-[2] self-start rounded-full p-3 bg-sky-400/80"
        >
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#010101"
          >
            <Path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </Svg>
        </Ripple>
        <View className={`w-full flex justify-center items-center mt-4`}>
          <ScrollView
            className={`rounded`}
            contentContainerStyle={{
              backgroundColor: "#f8fafc",
            }}
            horizontal
          >
            <Table borderStyle={{ borderColor: "#1f1f1f", borderWidth: 2 }}>
              <Row
                data={[
                  "Número de transacción",
                  "Nombre del cliente",
                  "Curso/Asesoría",
                  "Pendiente",
                  "Sesiones",
                  "Grupo",
                  "Ingreso",
                ]}
                widthArr={[150, 200, 200, 120, 120, 150, 150]}
                className="flex items-center justify-center"
                textStyle={{
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              />

              {tableData.map((rowData, index) => (
                <TouchableOpacity
                  className={`border-y-[0.1em]`}
                  android_ripple={{ color: "#1f1f1f" }}
                  key={index}
                  onPress={() => {
                    if (rowData[1] === "Juan Pérez") {
                      alert("¡Fila de Juan Pérez!");
                    } else if (rowData[1] === "María López") {
                      alert("¡Fila de María López!");
                    }
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <TableWrapper style={{ flexDirection: "row", flex: 1 }}>
                    <Cell
                      data={rowData[0]}
                      width={150}
                      textStyle={{ textAlign: "center", paddingVertical: 15 }}
                    />
                    <Cell
                      data={rowData[1]}
                      width={200}
                      textStyle={{ textAlign: "center" }}
                    />
                    <Cell
                      data={rowData[2]}
                      width={200}
                      textStyle={{ textAlign: "center" }}
                    />
                    <Cell
                      data={rowData[3]}
                      width={120}
                      textStyle={{ textAlign: "center" }}
                    />
                    <Cell
                      data={rowData[4]}
                      width={120}
                      textStyle={{ textAlign: "center" }}
                    />
                    <Cell
                      data={rowData[5]}
                      width={150}
                      textStyle={{ textAlign: "center" }}
                    />
                    <Cell
                      data={rowData[6]}
                      width={150}
                      textStyle={{ textAlign: "center" }}
                    />
                  </TableWrapper>
                </TouchableOpacity>
              ))}
            </Table>
          </ScrollView>
        </View>
      </View>
    </>
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
});
