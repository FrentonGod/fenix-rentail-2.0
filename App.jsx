import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import "./global.css";
import { useState, useContext } from "react";
import Svg, { Path, G } from "react-native-svg";
import { Table, Row, TableWrapper, Cell } from "react-native-table-component";
import Ripple from "react-native-material-ripple";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import TopBar from "./components/topbar.jsx";

function useTabPress(initialTab = 0) {
  const [selected, setSelected] = useState(initialTab);
  const isSelected = (tabIndex) => selected === tabIndex;
  const onPress = (tabIndex) => () => setSelected(tabIndex);

  return { selected, isSelected, onPress };
}

export default function App() {
  const { isSelected, onPress } = useTabPress(1);

  const [sideBar, setSideBar] = useState("");

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          backgroundColor: sideBar ? "#1f1f1f" : "#6F09EA",
          background: sideBar
            ? ""
            : "linear-gradient(90deg,rgba(111, 9, 234, 1) 0%, rgba(112, 9, 232, 1) 100%)",
        }}
        className={`flex-1 flex-col w-full`}
      >
        <TopBar sideBar={sideBar} setSideBar={setSideBar} />

        {}
        <View className="flex-1 p-2 bg-slate-50">
          <View className="flex flex-row gap-x-1 border-b border-[#dadce0]">
            <Pressable
              android_ripple={{
                radius: 100,
                color: "rgba(31, 31, 31, 0.6)",
                foreground: true,
              }}
              onPress={onPress(0)}
              className={`self-start active:rounded-none active:border-b-2 active:border-[#1f1f1f]/80 ${isSelected(0) ? "border-b-2 border-[#1f1f1f]" : "border-0"} p-2`}
            >
              <Text
                className={`select-none font-semibold uppercase ${isSelected(0) ? "text-[#1f1f1f]" : "text-[#70757a]"}`}
              >
                Venta rápida
              </Text>
            </Pressable>
            <Pressable
              android_ripple={{
                radius: 100,
                color: "rgba(31, 31, 31, 0.6)",
                foreground: true,
              }}
              onPress={onPress(1)}
              className={`self-start active:rounded-none active:border-b-2 active:border-[#1f1f1f]/80 ${isSelected(1) ? "border-b-2 border-[#1f1f1f]" : "border-0"} p-2`}
            >
              <Text
                className={`select-none font-semibold uppercase ${isSelected(1) ? "text-[#1f1f1f]" : "text-[#70757a]"}`}
              >
                Reporte
              </Text>
            </Pressable>
            <Pressable
              android_ripple={{
                radius: 100,
                color: "rgba(31, 31, 31, 0.6)",
                foreground: true,
              }}
              onPress={onPress(2)}
              className={`self-start active:rounded-none active:border-b-2 active:border-[#1f1f1f]/80 ${isSelected(2) ? "border-b-2 border-[#1f1f1f]" : "border-0"} p-2`}
            >
              <Text
                className={`select-none font-semibold uppercase ${isSelected(2) ? "text-[#1f1f1f]" : "text-[#70757a]"}`}
              >
                Catálogos
              </Text>
            </Pressable>
          </View>

          {isSelected(0) && (
            <ScrollView className={`flex-1 p-2`}>
              <TablaVentas />
            </ScrollView>
          )}

          {isSelected(1) && (
            <ScrollView contentContainerStyle={{flex:1, justifyContent:"center", alignItems:"center"}}>
              <View className={``}>
                <Text className={`uppercase font-semibold text-center`}>
                  Reporte de ventas mensuales
                </Text>
                <BarChart
                  className={``}
                  roundedTop
                  roundedBottom
                  hideRules
                  spacing={2}
                  showGradient
                  backgroundColor={`#F8FAFC`}
                  frontColor={`#6F09EA`}
                  gradientColor={`#A46CF5`}
                  width={``}
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

              <View className={``}>
                <Text className={`text-center`}>
                  Reporte de alúmnos registrados
                </Text>
                <BarChart
                  className={``}
                  roundedTop
                  roundedBottom
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
            </ScrollView>
          )}

          {isSelected(2) && (
            <ScrollView contentContainerStyle={{flexDirection:"row", justifyContent:"space-between"}} flex style={{}}>
              <View>
                <Text>Aquí se encuentran</Text>
                <Ripple
                  rippleContainerBorderRadius={10}
                  className={`self-start p-2`}
                >
                  <Text>Catálogo</Text>
                </Ripple>
              </View>
              <View>
                <Ripple className={`self-start p-2`}>
                  <Text>Tarifario</Text>
                </Ripple>
              </View>
            </ScrollView>
          )}
        </View>

        {}
        {}
        {}
        {}
        {}
        {}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const TablaVentas = () => {
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
      <View className={`w-full flex flex-row items-center justify-between`}>
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
        <BotonBusqueda />
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
                /**
                 * Se agregó un presable para que*/
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

const BotonBusqueda = () => {
  return (
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
  );
};
