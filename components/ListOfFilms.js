import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
  Platform,
  Keyboard,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function ListOfFilms({ navigation, route }) {
  const IMG_URL = "https://image.tmdb.org/t/p/w500";

  const [modalWid, setModalWid] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [groupList, setGroupList] = useState(route.params);
  const [keyValue, setKeyValue] = useState("watched");
  const [filmList, setFilmList] = useState([]);

  const addGroup = (keyText) => {
    if (!route.params.map((item) => item.key[0] === keyText).includes(true)) {
      route.params.push({ key: [keyText], films: [] });
    }
  };
  const searchGroups = (text) => {
    setGroupList([]);
    route.params.forEach((item) => {
      setGroupList((list) => {
        if (item.key[0].toLowerCase().includes(text.toLowerCase())) {
          return [...list, item];
        } else {
          return list;
        }
      });
    });
  };

  const deleteFilmFromList = (key) => {
    route.params.filter((obj) => obj.key[0] === keyValue)[0].films =
      route.params
        .filter((obj) => obj.key[0] === keyValue)[0]
        .films.filter((film) => film.key !== key);
    setFilmList(route.params.filter((obj) => obj.key[0] === keyValue)[0].films);
  };

  const deleteList = (key) => {
    route.params.filter((obj) => obj.key[0] === key)[0].key = [""];
    route.params = route.params.filter(
      (obj) => obj.key[0] !== key && obj.key[0] !== ""
    );
    setGroupList(route.params);
  };

  return (
    <View style={styles.main}>
      <TouchableOpacity style={styles.testButton} onPress={()=>navigation.navigate("Main")}/>
      <Modal visible={modalWid} onRequestClose={() => setModalWid(false)}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setModalWid(false)}>
            <Text style={styles.modalHeaderTitle}>{keyValue}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.table}>
          <FlatList
            data={filmList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.tableItem}
                onLongPress={() => {
                  deleteFilmFromList(item.key);
                }}
                onPress={() => {
                  navigation.navigate("Film", [item, route.params]);
                }}
              >
                <Image
                  style={styles.image}
                  source={
                    item.poster_path
                      ? { uri: IMG_URL + item.poster_path }
                      : require("../assets/no-image.png")
                  }
                />
              </TouchableOpacity>
            )}
            numColumns={3}
          />
        </View>
      </Modal>
      <View style={styles.groupManipulate}>
        <TextInput
          style={styles.groupSearch}
          placeholder={"Search..."}
          placeholderTextColor={"white"}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          onSubmitEditing={(event) => {
            searchGroups(event.nativeEvent.text);
            setSearchText("");
          }}
        />
        <AntDesign
          name="pluscircleo"
          size={24}
          color="#F60"
          onPress={() => {
            if (searchText) {
              addGroup(searchText);
              Keyboard.dismiss();
            }
            setSearchText("");
            searchGroups("");
          }}
        />
      </View>
      <FlatList
        data={groupList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemUserLists}
            onPress={() => {
              setKeyValue(item.key[0]);
              setFilmList(
                route.params.filter((obj) => obj.key[0] === item.key[0])[0]
                  .films
              );
              setModalWid(true);
            }}
            onLongPress={() => deleteList(item.key[0])}
          >
            <Text numberOfLines={1} style={styles.groupName}>
              {item.key}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  testButton:{
    width: "100%",
    height: "5%",
  },
  main: {
    backgroundColor: "#333",
    flex: 1,
    paddingTop: 40,
  },
  itemUserLists: {
    height: 40,
    marginHorizontal: 20,
  },
  groupName: {
    width: "100%",
    fontSize: 20,
    color: "white",
    borderColor: "#222",
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: "#303030",
    paddingHorizontal: 5,
  },
  groupSearch: {
    borderWidth: 2,
    borderColor: "#F60",
    paddingHorizontal: 5,
    borderRadius: 5,
    width: "90%",
    color: "white",
  },
  groupManipulate: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 20,
  },
  tableItem: {
    width: "33%",
    marginTop: 5,
  },
  table: {
    backgroundColor: "#333333",
    flex: 1,
    paddingBottom: 5,
  },
  image: {
    width: "95%",
    height: Dimensions.get("screen").width / 2,
    alignSelf: "center",
    borderColor: "#111111",
    borderWidth: 1,
  },
  modalHeader: {
    height: Platform.OS === "ios" ? 90 : 50,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#333",
    alignSelf: "center",
    paddingTop: Platform.OS === "ios" ? 40 : 0,
  },
  modalHeaderTitle: {
    color: "white",
    borderWidth: 2,
    borderColor: "#F60",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 35,
    height: 50,
  },
});
