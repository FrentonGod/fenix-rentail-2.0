import { View, Text, Button, Pressable, Animated } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useState, useEffect, useRef, createContext } from "react";
import Svg, { Path } from "react-native-svg";

const TopBar = ({ navigation, options }) => {
  return (
    <View>
      <View
        style={{
          backgroundColor: "#6F09EA",
          background:
            "linear-gradient(90deg,rgba(111, 9, 234, 1) 0%, rgba(112, 9, 232, 1) 100%)",
        }}
        className="h-fit flex items-center py-5"
      >
        <View className="w-[100%] flex flex-row items-center justify-between px-10 relative">
          

          <Pressable
            onPress={()=> navigation.toggleDrawer()}
          >
            <EvilIcons
              className="opacity-100"
              name="navicon"
              size={30}
              color={"white"}
            />
          </Pressable>

          <Text className="text-white uppercase w-fit">
            Sistema de Control de Ventas MQerk Academy
          </Text>
          <EvilIcons name="chart" size={30} color={`white`} />
        </View>
      </View>
    </View>
  );
};

export default TopBar;
