import {
  View,
  Text,
  TouchableNativeFeedback,
  TextInput,
  Modal,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from "react-native";
import globalColor from "../utils/global_color";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import DateTimePicker from "react-native-modal-datetime-picker";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase_config";

import SelectDropdown from "react-native-select-dropdown";

export default function EditModal({
  editModalVisible,
  setEditModalVisible,
  currentId,
}) {
  const { width, height } = useWindowDimensions();
  const [dateVisible, setDateVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({});

  const inputHandler = (enteredText, id) => {
    setData((prevState) => {
      return {
        ...prevState,
        [id]: enteredText,
      };
    });
  };

  const getData = async () => {
    if (currentId) {
      const res = await getDoc(doc(db, "todos", currentId));
      setData({
        ...res.data(),
        id: res.id,
        jadwal: res.data().jadwal?.toDate(),
      });
    }
  };

  const editHandler = async () => {
    if (data.task !== "") {
      setLoading(true);
      try {
        await updateDoc(doc(db, "todos", currentId), data);
        setLoading(false);
        setEditModalVisible(false);
        Alert.alert("Success", "Data Berhasil Diubah");
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", error.message);
      }
    }
  };

  useEffect(() => {
    getData();
  }, [currentId]);

  return (
    <>
      {/* Calendar Modal */}
      <DateTimePicker
        isVisible={dateVisible}
        is24Hour={true}
        mode="datetime"
        onConfirm={(date) => {
          if (date > new Date()) {
            inputHandler(date, "jadwal");
          } else {
            Alert.alert(
              "Pilih jadwal yang benar",
              "Jadwal yang ditentukan tidak boleh kurang dari waktu saat ini"
            );
          }
          setDateVisible(false);
        }}
        onCancel={() => setDateVisible(false)}
        style={{ elevation: 99 }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
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
              padding: 20,
              width: width * 0.8,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          >
            {/* Pick Date  */}
            <TouchableNativeFeedback
              onPress={() => setDateVisible(!dateVisible)}
            >
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: globalColor.primary,
                  padding: 10,
                  borderRadius: 5,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {data.jadwal == undefined ? (
                  <>
                    <Text style={{ color: "white", marginRight: 15 }}>
                      Pilih Jadwal
                    </Text>
                    <Ionicons name="calendar" size={20} color="white" />
                  </>
                ) : (
                  <Text style={{ color: "white" }}>
                    {data.jadwal?.toString()}
                  </Text>
                )}
              </View>
            </TouchableNativeFeedback>

            {/* Input Kegiatan  */}
            <TextInput
              onChangeText={(e) => inputHandler(e, "task")}
              style={{
                padding: 10,
                paddingHorizontal: 10,
                borderWidth: 0.25,
                marginTop: 15,
                borderColor: "gray",
              }}
              value={data.task}
              placeholder="Masukkan Rencana Kegiatan"
            />

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginTop: 10, marginRight: 10 }}>Status :</Text>
              <SelectDropdown
                data={["Dalam Proses", "Selesai", "Dibatalkan"]}
                defaultValue={data?.status}
                onSelect={(selectedItem, index) => {
                  inputHandler(selectedItem, "status");
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={{
                  flex: 1,
                  marginTop: 10,
                  height: 35,
                }}
                buttonTextStyle={{ fontSize: 16 }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 15,
              }}
            >
              {loading ? (
                // Loading Progress
                <ActivityIndicator size="large" color="purple" />
              ) : (
                <>
                  {/* Cancel Button  */}
                  <TouchableNativeFeedback
                    onPress={() => setEditModalVisible(false)}
                  >
                    <View
                      style={{
                        backgroundColor: globalColor.cancel,
                        padding: 10,
                        borderRadius: 5,
                        flex: 1,
                      }}
                    >
                      <Text style={{ color: "white", textAlign: "center" }}>
                        Batal
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                  {/* Add Button  */}
                  <TouchableNativeFeedback onPress={() => editHandler()}>
                    <View
                      style={{
                        backgroundColor: globalColor.primary,
                        padding: 10,
                        borderRadius: 5,
                        marginLeft: 10,
                        flex: 1,
                      }}
                    >
                      <Text style={{ color: "white", textAlign: "center" }}>
                        Ubah
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                </>
              )}
            </View>
          </View>
          {/* Box Modal End  */}
        </View>
      </Modal>
    </>
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
