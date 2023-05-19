import {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  useWindowDimensions,
} from "react-native";
import React from "react";
import globalColor from "../utils/global_color";

import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IntroScreen({ navigation }) {
  const myImage = require("../assets/illustration.png");
  const dimensions = useWindowDimensions();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        padding: 30,
        paddingVertical: 40,
      }}
    >
      <Text
        style={{ color: globalColor.primary, fontWeight: "bold", fontSize: 24 }}
      >
        Todos App
      </Text>
      <View style={{ alignItems: "center" }}>
        <Image source={myImage} />
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
            marginTop: 20,
            color: globalColor.primary,
          }}
        >
          Selamat Datang di Todos App
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "400",
            fontSize: 16,
            marginTop: 8,
            opacity: 0.7,
            maxWidth: dimensions.width * 0.8,
          }}
        >
          Todos App akan membantu kamu untuk mengatur kegiatan sehari-hari agar
          lebih produktif{" "}
        </Text>
      </View>
      <TouchableNativeFeedback onPress={() => navigation.replace("Home")}>
        <View
          style={{
            backgroundColor: globalColor.primary,
            padding: 15,
            paddingHorizontal: 20,
            borderRadius: 10,
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: 700,
              textAlign: "center",
              marginRight: 15,
            }}
          >
            Mulai Sekarang
          </Text>
          <Ionicons name="rocket" color="white" size={16} />
        </View>
      </TouchableNativeFeedback>
    </SafeAreaView>
  );
}
