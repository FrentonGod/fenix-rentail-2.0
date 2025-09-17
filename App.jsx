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
import Svg, { Path } from "react-native-svg";
import { Table, Row, TableWrapper, Cell } from "react-native-table-component";
import Ripple from "react-native-material-ripple";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";

import TopBar from "./components/topbar.jsx";

function useTabPress(initialTab = 0) {
  const [selected, setSelected] = useState(initialTab);
  const isSelected = (tabIndex) => selected === tabIndex;
  const onPress = (tabIndex) => () => setSelected(tabIndex);

  return { selected, isSelected, onPress };
}

export default function App() {
  const { isSelected, onPress } = useTabPress(2);

  const [sideBar, setSideBar] = useState("");

  const [tarifario, setTarifario] = useState("");

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

          {isSelected(1) && <SeccionReportes />}

          {isSelected(2) && (
            <View className={`p-2`}>
              <View className={`items-center`}>
                <View
                  className={`p-2 justify-center flex-row bg-gray-300 rounded gap-x-2`}
                >
                  <View className={``}>
                    <Ripple
                      rippleContainerBorderRadius={5}
                      className={`self-start p-2 justify-center items-center ${tarifario ? "" : "bg-white"} rounded`}
                      onPress={() => setTarifario(false)}
                    >
                      <Text className={`uppercase font-semibold`}>
                        Catálogo
                      </Text>
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
                      className={`self-start p-2 justify-center items-center ${tarifario ? "bg-white" : ""} rounded`}
                      onPress={() => setTarifario(true)}
                    >
                      <Text className={`uppercase font-semibold`}>
                        Tarifario
                      </Text>
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

              {tarifario ? (
                <PagerView className={`flex-1 bg-black`} initialPage={0}>
                  <View className={`flex-1`} key="1">
                    <Text>Hola </Text>
                  </View>
                  <View key="2">
                    <Text>Hola</Text>
                  </View>
                </PagerView>
              ) : (
                <></>
              )}
            </View>
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

const SeccionReportes = () => {
  return (
    <View className={`flex-1 p-2`}>
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
