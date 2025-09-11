import { View, Text, Button, Pressable, Animated } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useState, useEffect, useRef, createContext } from "react";
import Svg, { Path } from "react-native-svg";

import Ripple from "react-native-material-ripple";

const TopBar = () => {
  const [sideBar, setSideBar] = useState("");

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (sideBar) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [sideBar]);
  return (
    <View className={`relative z-[5]`}>
      <View style={{ backgroundColor: "#6F09EA", background: "linear-gradient(90deg,rgba(111, 9, 234, 1) 0%, rgba(112, 9, 232, 1) 100%)" }} className="h-fit flex items-center py-5">
        <View className="w-[100%] flex flex-row items-center justify-between px-10 relative mt-6">
          <EvilIcons name="" />

          <Pressable
          android_ripple={{radius:30, borderless:true, color:"rgba(0, 255, 180, 0.25)", foreground:true}}
            className="flex flex-row absolute -left-2 z-[2]"
            onPress={() => setSideBar(!sideBar)}
          >
            <EvilIcons
              className="opacity-100 pr-10"
              name="navicon"
              size={30}
              color={"white"}
            />

            {/* El padding right es para aumentar el hitbox del Pressable */}
          </Pressable>

          <Text className="text-white uppercase text-2xl absolute left-7 vertical:opacity-0 horizontal:opacity-100">
            Fenix Rentail
          </Text>
          <Text className="text-white uppercase w-fit">
            Sistema de Control de Ventas MQerk Academy
          </Text>
          <EvilIcons name="chart" size={30} color={`white`} />
        </View>
      </View>
      {sideBar && (
        <>
        {/* El margin left es para que no cubra los botones del sidebar */}
        <Pressable
          className={`top-0 left-0 ml-[10.7em] absolute w-screen h-screen z-[6] bg-transparent`}
          style={{backgroundColor:("rgba(0,0,0,0.3)")}}
          onPress={() => setSideBar(false)}
          pointerEvents="auto"
        />
        {/* Este pressable es para que se cierre el sidebar, el elemento se renderiza solo cuando cambia el estado */}
      
      <Animated.View
        pointerEvents={sideBar ? "auto" : "none"}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 5,
          backgroundColor: sideBar ? "rgba(0,0,0,0.3)" : "",
        }}
      >
        <Animated.View
          style={{
            transform: [{ translateX: animatedValue }],
            width: 150,
            height: "100%",
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            position: "relative",
            gap: 32,
            alignItems: "center",
            zIndex: 7,
          }}
        >
          <View
            className={`flex relative rounded-r-lg w-[150] py-[40] bg-[#232428] h-screen z-[7] gap-y-8 vertical:gap-y-15 items-center text-white w-30`}
          >
            <Pressable
              onPress={() => {}}
              id="inicio"
              className={`flex flex-row justify-between px-4 w-full items-center`}
            >
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                viewBox="0 -960 960 960"
                width="30px"
                fill="#bcc7d1"
              >
                <Path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
              </Svg>
              <Text className={`pl-5 w-full text-[#6b838b] select-none`}>Inicio</Text>
            </Pressable>

            <Pressable
              id="estudiantes"
              className={`flex flex-row w-full justify-between px-4 items-center`}
            >
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                viewBox="0 -960 960 960"
                width="30px"
                fill="#bcc7d1"
              >
                <Path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z" />
              </Svg>
              <Text className={`pl-5 w-full text-[#6b838b] select-none`}>Estudiantes</Text>
            </Pressable>

            <Pressable
              id="asesores"
              className={`flex flex-row w-full justify-between px-4 items-center`}
            >
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                viewBox="0 -960 960 960"
                width="30px"
                fill="#bcc7d1"
              >
                <Path d="M840-120v-640H120v320H40v-320q0-33 23.5-56.5T120-840h720q33 0 56.5 23.5T920-760v560q0 33-23.5 56.5T840-120ZM360-400q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM40-80v-112q0-34 17.5-62.5T104-298q62-31 126-46.5T360-360q66 0 130 15.5T616-298q29 15 46.5 43.5T680-192v112H40Zm80-80h480v-32q0-11-5.5-20T580-226q-54-27-109-40.5T360-280q-56 0-111 13.5T140-226q-9 5-14.5 14t-5.5 20v32Zm240-400Zm0 400Z" />
              </Svg>
              <Text className={`w-full pl-5 text-[#6b838b] select-none`}>Asesores</Text>
            </Pressable>

            <Pressable
              id="pagos"
              className={`flex flex-row justify-between px-4 w-full items-center`}
            >
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                viewBox="0 -960 960 960"
                width="30px"
                fill="#bcc7d1"
              >
                <Path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" />
              </Svg>
              <Text className={`w-full pl-5 text-[#6b838b] select-none`}>Pagos</Text>
            </Pressable>

            <Pressable
              id="calendario"
              className={`flex flex-row w-full justify-between px-4 items-center`}
            >
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                viewBox="0 -960 960 960"
                width="30px"
                fill="#bcc7d1"
              >
                <Path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
              </Svg>
              <Text className={`w-full pl-5 text-[#6b838b] select-none`}>Calendario</Text>
            </Pressable>

            <Pressable
              id="cursos"
              className={`flex flex-row w-full justify-between px-4 items-center`}
            >
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                viewBox="0 -960 960 960"
                width="30px"
                fill="#bcc7d1"
              >
                <Path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" />
              </Svg>
              <Text className={`w-full pl-5 text-[#6b838b] select-none`}>Cursos</Text>
            </Pressable>

            <Pressable
              id="logout"
              className={`flex flex-row items-center justify-between absolute vertical:bottom-10 left-4 bottom-12`}
            >
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                viewBox="0 -960 960 960"
                width="30px"
                fill="#dc2626"
              >
                <Path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
              </Svg>
              <Text className={`w-full pl-5 text-[#dc2626] select-none`}>Cerrar sesión</Text>
            </Pressable>
          </View>
          
        </Animated.View>
      </Animated.View>
      </>
      )}
      
    </View>
  );
};

export default TopBar;
