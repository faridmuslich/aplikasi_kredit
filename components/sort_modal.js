import {
  View,
  Text,
  Modal,
  StyleSheet,
  useWindowDimensions,
  TouchableNativeFeedback,
} from "react-native";
import React from "react";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function SortModal({
  sortModalVisible,
  setSortModalVisible,
  sortHandler,
}) {
  const { width, height } = useWindowDimensions();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={sortModalVisible}
      style={{ elevation: 98 }}
    >
      {/* Overlay  */}
      <View style={[styles.overlay, { height, width }]} />

      {/* Box Modal  */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: width * 0.8,
            backgroundColor: "white",
            borderRadius: 5,
          }}
        >
          {sortList.map((x) => {
            return (
              <TouchableNativeFeedback
                key={x.label}
                onPress={() => {
                  sortHandler(x.type, x.descending);
                  setSortModalVisible(false);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 10,
                  }}
                >
                  <Text>{x.label}</Text>
                  {x.icon}
                </View>
              </TouchableNativeFeedback>
            );
          })}
        </View>
        {/* Box Modal End  */}
      </View>
    </Modal>
  );
}
var styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: "black",
  },
});

const sortList = [
  {
    type: "alphabet",
    descending: true,
    label: "Urutkan Menurut Alphabet ( A - Z )",
    icon: <FontAwesome5 name="sort-alpha-down" size={20} />,
  },
  {
    type: "alphabet",
    descending: false,
    label: "Urutkan Menurut Alphabet ( Z - A )",
    icon: <FontAwesome5 name="sort-alpha-up" size={20} />,
  },
  {
    type: "date",
    descending: true,
    label: "Urutkan Menurut Tanggal Paling Akhir",
    icon: <MaterialCommunityIcons name="sort-calendar-descending" size={20} />,
  },
  {
    type: "date",
    descending: false,
    label: "Urutkan Menurut Tanggal Paling Awal",
    icon: <MaterialCommunityIcons name="sort-calendar-ascending" size={20} />,
  },
];
