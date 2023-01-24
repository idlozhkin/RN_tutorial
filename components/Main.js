import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from '../firebase/firebase'


let userLists = [
  {
    films: [],
    key: ["watched"],
  },
  {
    films: [],
    key: ["want to watch"],
  },
];

export default function Main({ navigation }) {
  const API_KEY = "api_key=6181efb77b46c96af6133629401e2718";
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const POPULAR_URL =
    BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
  const SEARCH_URL = BASE_URL + "/search/movie?" + API_KEY + "&page=1&query=";
  const SEARCH_URL_TV = BASE_URL + "/search/tv?" + API_KEY + "&page=1&query=";

  const [films, setFilms] = useState([]);

  const searchMovies = (url) => {
    if (url === SEARCH_URL) {
      url = POPULAR_URL;
    }
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setAtributes(json.results);
      });
  };

  const setAtributes = (data) => {
    data.forEach((movie) => {
      const {
        title,
        poster_path,
        vote_average,
        overview,
        id,
        backdrop_path,
        genre_ids,
        release_date,
        first_air_date,
        name,
      } = movie;

      setFilms((list) => {
        return [
          ...list,
          {
            backdrop_path: IMG_URL + backdrop_path,
            genre_ids: genre_ids,
            title: title ? title : name,
            poster_path: poster_path,
            vote_average: vote_average,
            overview: overview,
            key: id,
            release_date: release_date ? release_date : first_air_date,
            comment: "",
          },
        ];
      });
    });
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@storage_Key");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };
  const setCloudData = async (jsonValue)=>{
    db
      .firestore()
      .collection('movies')
      .doc(userCredentials.user.email)
      .set({
          json:jsonValue
  })
  }

const getCloudData = async () => {
  const moviesJSON = db
      .firestore()
      .collection('movies')
      .doc(userCredentials.user.email)
      .get();
  return moviesJSON;
}
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@storage_Key", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      storeData(userLists);
      userLists = userLists?.filter((obj) => obj.key[0] !== "");
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getData().then((value) => (userLists = value));
    setFilms([]);
    searchMovies(POPULAR_URL);
    navigation.setOptions({
      headerRight: () => (
        <View paddingRight={30} width="75%">
          <TextInput
            style={styles.searchInput}
            placeholder={"Search..."}
            onSubmitEditing={(event) => {
              setFilms([]);
              searchMovies(SEARCH_URL + event.nativeEvent.text);
              if (event.nativeEvent.text) {
                searchMovies(SEARCH_URL_TV + event.nativeEvent.text);
              }
            }}
          />
        </View>
      ),
    });
  }, []);

  return (
    <View style={styles.table}>
      <FlatList
        data={films}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tableItem}
            onPress={() => {
              navigation.navigate("Film", [item, userLists]);
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
      <TouchableOpacity
        style={styles.listButton}
        onPress={() => {
          userLists = userLists.filter((obj) => obj.key[0] !== "");
          navigation.navigate("ListOfFilms", userLists);
        }}
      >
        <Entypo name="list" size={36} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  searchInput: {
    borderWidth: 2,
    borderColor: "#333333",
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
  listButton: {
    position: "absolute",
    bottom: 30,
    right: 10,
    borderRadius: 50,
    backgroundColor: "#F60",
    width: 50,
    height: 50,
    paddingLeft: 7,
    paddingTop: 7,
  },
});
