import { View, Text, TouchableNativeFeedback, Alert } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import globalColor from "../utils/global_color";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase_config";

export default function TodoCard({
  id,
  task,
  status,
  jadwal,
  setEditModalVisible,
  setCurrentId,
}) {
  const deleteHandler = async () => {
    try {
      await deleteDoc(doc(db, "todos", id));
      Alert.alert("Success", "Data Berhasil Dihapus");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const hours = jadwal.toDate().getHours();
  const minutes = jadwal.toDate().getMinutes();

  return (
    <>
      <TouchableNativeFeedback>
        <View
          style={{
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
            backgroundColor: "white",
          }}
        >
          <View>
            <Text style={{ fontWeight: "500", fontSize: 16 }}>{task}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color:
                  status === "Selesai"
                    ? globalColor.completed
                    : status === "Dalam Proses"
                    ? globalColor.pending
                    : globalColor.cancel,
                fontWeight: "500",
              }}
            >
              {status}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ color: "gray" }}>
                {hours}:{minutes == 0 ? "00" : minutes}{" "}
                {hours >= 12 && hours <= 24 ? "PM" : "AM"}
              </Text>
            </View>
            <View style={{ flexDirection: "row", width: "20%" }}>
              <TouchableNativeFeedback
                onPress={() => {
                  setEditModalVisible(true);
                  setCurrentId(id);
                }}
              >
                <View style={{ marginRight: 15 }}>
                  <FontAwesome5
                    name="edit"
                    size={20}
                    color={globalColor.primary}
                  />
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => deleteHandler()}>
                <Ionicons name="trash" size={20} color="gray" />
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </>
  );
}
