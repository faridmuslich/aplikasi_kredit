import {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  TextInput,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import globalColor from "../utils/global_color";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddModal from "../components/add_modal";
import { collection, onSnapshot, where } from "firebase/firestore";
import { db } from "../firebase_config";
import TodoCard from "../components/todo_card";
import EditModal from "../components/edit_modal";
import SortModal from "../components/sort_modal";

export default function HomeScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [groupedTodos, setGroupedTodos] = useState({});

  const groupTodos = (data) => {
    setGroupedTodos(
      data.reduce((grouped, item) => {
        const jadwal = item.jadwal.toDate().toDateString();
        if (grouped[jadwal]) {
          // Jika kelompok jadwal sudah ada, tambahkan item ke dalamnya
          grouped[jadwal].push(item);
        } else {
          // Jika kelompok jadwal belum ada, buat kelompok baru dan masukkan item pertama ke dalamnya
          grouped[jadwal] = [item];
        }
        return grouped;
      }, {})
    );
  };

  useEffect(() => {
    onSnapshot(collection(db, "todos"), (snapshot) => {
      var data = [];
      snapshot.docs.map((x) => data.push({ ...x.data(), id: x.id }));
      data.sort(
        (a, b) => new Date(b.jadwal.toDate()) - new Date(a.jadwal.toDate())
      );
      setTodos(data);
      setFilteredTodos(data);
      groupTodos(data);
    });
  }, []);

  const searchHandler = (value) => {
    const filteredData = todos.filter((x) =>
      x.task.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTodos(filteredData);
    groupTodos(filteredData);
  };

  const sortHandler = (type, descending) => {
    let sortedData = [];
    if (type === "date" && descending) {
      sortedData = [
        ...filteredTodos.sort(
          (a, b) => new Date(b.jadwal.toDate()) - new Date(a.jadwal.toDate())
        ),
      ];
    } else if (type == "date" && !descending) {
      sortedData = [
        ...filteredTodos.sort(
          (a, b) => new Date(a.jadwal.toDate()) - new Date(b.jadwal.toDate())
        ),
      ];
    } else if (type === "alphabet" && descending) {
      sortedData = [
        ...filteredTodos
          .sort((a, b) => a.task.localeCompare(b.task))
          .sort(
            (a, b) => new Date(b.jadwal.toDate()) - new Date(a.jadwal.toDate())
          ),
      ];
    } else if (type === "alphabet" && !descending) {
      sortedData = [
        ...filteredTodos
          .sort((a, b) => b.task.localeCompare(a.task))
          .sort(
            (a, b) => new Date(b.jadwal.toDate()) - new Date(a.jadwal.toDate())
          ),
      ];
    }
    setFilteredTodos(sortedData);
    groupTodos(sortedData);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 30 }}
    >
      {/* Action Modal  */}
      <AddModal
        addModalVisible={addModalVisible}
        setAddModalVisible={setAddModalVisible}
      />
      <EditModal
        currentId={currentId}
        editModalVisible={editModalVisible}
        setEditModalVisible={setEditModalVisible}
      />
      <SortModal
        sortModalVisible={sortModalVisible}
        setSortModalVisible={setSortModalVisible}
        sortHandler={sortHandler}
      />

      <TouchableNativeFeedback>
        <View
          style={{
            padding: 10,
            paddingHorizontal: 15,
            backgroundColor: globalColor.primary,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 10,
          }}
        >
          <View>
            <Text style={{ color: "white", fontSize: 20 }}>Atur Waktumu</Text>
            <Text style={{ color: "white", fontSize: 20 }}>
              Secara Produktif
            </Text>
          </View>

          <Image
            style={{ width: 125, height: 125 }}
            source={require("../assets/note.png")}
          />
        </View>
      </TouchableNativeFeedback>

      <View
        style={{ flexDirection: "row", marginTop: 20, alignItems: "center" }}
      >
        {/* Search Todo  */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            padding: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
            flex: 1,
          }}
        >
          <TextInput
            onChangeText={searchHandler}
            style={{ flex: 1 }}
            placeholder="Cari Kegiatan"
          />
          <Ionicons name="search" size={20} color="gray" />
        </View>

        <TouchableNativeFeedback onPress={() => setSortModalVisible(true)}>
          <View
            style={{
              backgroundColor: globalColor.primary,
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              marginLeft: 15,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", marginRight: 10 }}>Urutkan</Text>
            <Ionicons name="car-sport-outline" color="white" size={20} />
          </View>
        </TouchableNativeFeedback>
      </View>

      {/* Todo List  */}
      <FlatList
        style={{ marginTop: 20 }}
        data={Object.entries(groupedTodos)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => {
          const jadwal = item[0];
          const todosInGroup = item[1];
          return (
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                {jadwal}
              </Text>
              {todosInGroup.map((todo) => (
                <TodoCard
                  key={todo.id}
                  id={todo.id}
                  setEditModalVisible={setEditModalVisible}
                  task={todo.task}
                  status={todo.status}
                  jadwal={todo.jadwal}
                  setCurrentId={setCurrentId}
                />
              ))}
            </View>
          );
        }}
      />

      {/* Floating Add Button  */}
      <TouchableOpacity
        onPress={() => setAddModalVisible(true)}
        style={{
          position: "absolute",
          right: 30,
          bottom: 30,
          backgroundColor: globalColor.primary,
          padding: 10,
          borderRadius: 50,
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
