import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import { Fontisto } from "@expo/vector-icons";

export default function App() {
  const [working, setWorking] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => {
    setWorking(false);
  };
  const work = () => {
    setWorking(true);
  };
  const onChangeText = (payload) => {
    setText(payload);
  };
  const STORAGE_KEY = "@toDos";
  const addtoDo = async () => {
    if (text == "") return;
    const newToDos = { ...toDos, [Date.now()]: { text, working, isFinish } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const toDosJson = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(toDosJson));
  };
  const deleteToDo = async (key) => {
    Alert.alert("Delete To DO?", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
    return;
  };
  useEffect(() => {
    loadToDos();
  }, []);
  const finishFn = async ({ isEnd, key }) => {
    setIsFinish(isEnd);
    const newToDos = { ...toDos };
    newToDos[key].isFinish = isEnd;
    setToDos(newToDos);
    await saveToDos(newToDos);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? theme.white : theme.gray,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? theme.gray : theme.white,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addtoDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        style={styles.input}
        placeholder={working ? "Add a To Do" : "Where do you want to go"}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <View style={styles.toDoIcons}>
                {toDos[key].isFinish ? (
                  <TouchableOpacity
                    onPress={() => finishFn({ isEnd: false, key })}
                  >
                    <Fontisto name="checkbox-active" size={24} color="teal" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => finishFn({ isEnd: true, key })}
                  >
                    <Fontisto name="checkbox-passive" size={24} color="white" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => deleteToDo(key)}
                >
                  <Fontisto name="trash" size={24} color="tomato" />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.gray,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: theme.white,
    fontSize: 16,
    fontWeight: "500",
  },
  toDoIcons: {
    flexDirection: "row",
  },
  deleteIcon: {
    marginLeft: 10,
  },
});
