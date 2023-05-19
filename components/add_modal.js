import {
  View,
  Text,
  TouchableNativeFeedback,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import globalColor from "../utils/global_color";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase_config";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "react-native-modal-datetime-picker";

export default function AddModal({ addModalVisible, setAddModalVisible }) {
  const [dateVisible, setDateVisible] = useState(false);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const { width, height } = useWindowDimensions();
  const [pickedDate, setPickedDate] = useState(null);

  const inputHandler = (enteredText) => {
    setTask(enteredText);
  };

  const addTodo = async () => {
    if (task !== "" && pickedDate !== null) {
      setLoading(true);
      try {
        await addDoc(collection(db, "todos"), {
          createdAt: serverTimestamp(),
          task: task,
          status: "Dalam Proses",
          jadwal: pickedDate,
        });
        setTask("");
        setPickedDate(null);
        setLoading(false);
        setAddModalVisible(false);
        Alert.alert("Berhasil", "Kegiatan Berhasil Ditambahkan");
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", error.message);
      }
    } else if (task === "") {
      Alert.alert("Error", "Masukkan Rencana Kegiatan");
    } else if (pickedDate === null) {
      Alert.alert("Error", "Pilih Jadwal");
    }
  };

  return (
    <>
      {/* Calendar Modal */}
      <DateTimePicker
        isVisible={dateVisible}
        is24Hour={true}
        mode="datetime"
        onConfirm={(date) => {
          if (date > new Date()) {
            setPickedDate(date);
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
        visible={addModalVisible}
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
                {pickedDate == null ? (
                  <>
                    <Text style={{ color: "white", marginRight: 15 }}>
                      Pilih Jadwal
                    </Text>
                    <Ionicons name="calendar" size={20} color="white" />
                  </>
                ) : (
                  <Text style={{ color: "white" }}>
                    {pickedDate.toString()}
                  </Text>
                )}
              </View>
            </TouchableNativeFeedback>

            {/* Input Kegiatan  */}
            <TextInput
              onChangeText={inputHandler}
              style={{
                padding: 10,
                paddingHorizontal: 10,
                borderWidth: 0.25,
                marginTop: 15,
                borderColor: "gray",
              }}
              value={task}
              placeholder="Masukkan Rencana Kegiatan"
            />

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
                    onPress={() => setAddModalVisible(false)}
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
                        Batalkan
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                  {/* Add Button  */}
                  <TouchableNativeFeedback onPress={() => addTodo()}>
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
                        Tambahkan
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
