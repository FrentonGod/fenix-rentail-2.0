import "react-native-gesture-handler";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import "./global.css";
import { useState } from "react";
import Svg, { Path } from "react-native-svg";
import { Table, Row, TableWrapper, Cell } from "react-native-table-component";
import Ripple from "react-native-material-ripple";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import { WebView } from "react-native-webview";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import TopBar from "./components/topbar.jsx";

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
      <Tab.Screen name="Catalogos" component={SeccionCatalogos} />
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
  return <Text>Pantalla para pagos</Text>;
};

const ScreenFinanzas = () => {
  return <Text>Pantalla para finanzas</Text>;
};

const ScreenCalendario = () => {
  return <Text>Pantalla para calendario</Text>;
};

const ScreenCursos = () => {
  return <Text>Pantalla para cursos</Text>;
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
              width: "fit-content",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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

const SeccionCatalogos = () => {
  const [catalogos, setCatalogos] = useState("");

  const catalogoUri = "https://pdfobject.com/pdf/sample.pdf";
  const tarifarioUri = "https://pdfobject.com/pdf/sample.pdf";

  const pdfUrl = catalogos ? tarifarioUri : catalogoUri;
  return (
    <View className={`flex-1 bg-slate-50`}>
      <View className={`items-center p-2`}>
        <View
          className={`p-2 justify-center flex-row bg-gray-300 rounded gap-x-2`}
        >
          <View className={``}>
            <Ripple
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
      <View className={`flex-1 justify-center p-5 w-[50%] rounded`}>

        <WebView
          style={{ flex:1, alignItems:"center"}}
          // Usamos el visor de Google Docs para una mejor experiencia en móvil
          source={{
            uri: `https://docs.google.com/gview?embedded=true&url=${pdfUrl}`,
          }}
          startInLoadingState={true}
        />
      </View>
    </View>
  );
};
