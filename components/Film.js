import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  ImageBackground,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Platform,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";

const genreList = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};
const IMG_URL = "https://image.tmdb.org/t/p/w500";

export default function Film({ navigation, route }) {
  const bsRef = React.createRef();
  const fall = new Animated.Value(1);
  const bscRef = React.createRef();
  const fallc = new Animated.Value(1);

  const [groupList, setGroupList] = useState(route.params[1]);
  const [searchText, setSearchText] = useState("");
  const [commentText, setCommentText] = useState(route.params[0].comment);

  const addGroup = (keyText) => {
    if (
      !route.params[1].map((item) => item.key[0] === keyText).includes(true)
    ) {
      route.params[1].push({ key: [keyText], films: [] });
    }
  };

  const searchGroups = (text) => {
    setGroupList([]);
    route.params[1].forEach((item) => {
      setGroupList((list) => {
        if (item.key[0].toLowerCase().includes(text.toLowerCase())) {
          return [...list, item];
        } else {
          return list;
        }
      });
    });
  };

  const getMarkColor = () => {
    if (route.params[0].vote_average >= 8) {
      return "green";
    } else if (route.params[0].vote_average >= 4) {
      return "yellow";
    }
    return "red";
  };

  const addFilmToList = (listName) => {
    route.params[1].forEach((item) => {
      if (item.key[0] === listName && !item.films.includes(route.params[0])) {
        item.films.push(route.params[0]);
      }
    });
  };

  const getGenreList = (genre_ids) => {
    let res = "";
    genre_ids.forEach((item) => {
      res += genreList[item] + ", ";
    });
    return res.substring(0, res.length - 2);
  };

  const renderInner = () => (
    <View style={styles.innerContent}>
      <View style={styles.groupManipulate}>
        <TextInput
          value={searchText}
          style={styles.groupSearch}
          placeholder={"Search..."}
          placeholderTextColor={"white"}
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
              addFilmToList(item.key[0]);
            }}
          >
            <Text numberOfLines={1} style={styles.groupName}>
              {item.key[0]}
            </Text>
            <AntDesign
              style={styles.checkBox}
              name="pluscircleo"
              size={24}
              color="#F60"
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderInnerCom = () => (
    <View style={styles.commentMain}>
      <TextInput
        multiline
        placeholder="Comment..."
        style={styles.textComment}
        maxLength={256}
        onChangeText={(text) => {
          setCommentText(text);
          route.params[0].comment = text;
        }}
        value={commentText}
      />
    </View>
  );

  const renderHeader = () => (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.header}
      onPressOut={() => Keyboard.dismiss()}
    >
      <View style={styles.panelHandle} />
    </TouchableOpacity>
  );

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Main");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <Animated.View style={styles.main}>
      <TouchableOpacity style={styles.testButton} onPress={()=>navigation.navigate("Main")}/>
      <BottomSheet
        ref={bsRef}
        snapPoints={[Platform.OS === "ios" ? 600 : 500, 0]}
        initialSnap={1}
        callbackNode={fall}
        enabledContentGestureInteraction={false}
        renderContent={renderInner}
        renderHeader={renderHeader}
      />
      <BottomSheet
        ref={bscRef}
        snapPoints={[Platform.OS === "ios" ? 600 : 250, 0]}
        initialSnap={1}
        callbackNode={fallc}
        enabledContentGestureInteraction={false}
        renderContent={renderInnerCom}
        renderHeader={renderHeader}
      />
      <ImageBackground
        style={styles.backImage}
        source={{ uri: route.params[0].backdrop_path }}
        blurRadius={0.1}
      >
        <LinearGradient
          colors={["#00000000", "#333333"]}
          style={styles.gradient}
        />
      </ImageBackground>
      <View style={styles.mainInfo}>
        <Image
          style={styles.image}
          source={
            route.params[0].poster_path
              ? { uri: IMG_URL + route.params[0].poster_path }
              : require("../assets/no-image.png")
          }
        />
        <Text style={styles.title}>{route.params[0].title}</Text>
        <View style={styles.markBackground}>
          <Text
            style={{
              fontSize: 20,
              color: getMarkColor(),
              fontWeight: "bold",
            }}
          >
            {route.params[0].vote_average}
          </Text>
        </View>
        <Text style={styles.dateGenre}>
          {route.params[0].release_date
            ? route.params[0].release_date.substr(8, 2) +
              "." +
              route.params[0].release_date.substr(5, 2) +
              "." +
              route.params[0].release_date.substr(0, 4)
            : ""}
        </Text>
        <Text style={styles.dateGenre}>
          {getGenreList(route.params[0].genre_ids)}
        </Text>
        <View style={{ height: "40%", paddingTop: 10 }}>
          <ScrollView>
            <Text style={styles.overview}>{route.params[0].overview}</Text>
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity
        style={styles.star}
        onPress={() => {
          bsRef.current.snapTo(0);
          bscRef.current.snapTo(1);
        }}
      >
        <AntDesign name="staro" size={30} color={"white"} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.edit}
        onPress={() => {
          bscRef.current.snapTo(0);
          bsRef.current.snapTo(1);
        }}
      >
        <Entypo name="edit" size={30} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  testButton:{
    width: "100%",
    height: "5%",
  },
  image: {
    width: Dimensions.get("screen").width / 2,
    height: (Dimensions.get("screen").width / 2) * 1.5,
    borderColor: "#111111",
    borderWidth: 1,
  },
  main: {
    flex: 1,
    backgroundColor: "#333333",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 0.5,
  },
  mainInfo: {
    position: "absolute",
    top: (Dimensions.get("screen").width / 2) * 1.5 - 150,
    alignItems: "center",
  },
  markBackground: {
    width: 40,
    alignItems: "center",
    borderRadius: 3,
  },
  backImage: {
    width: "100%",
  },
  gradient: {
    width: "100%",
    height: Dimensions.get("screen").width / 1.8,
  },
  overview: {
    color: "white",
    fontSize: 17,
    paddingHorizontal: 20,
    lineHeight: 22,
    paddingTop: 10,
  },
  dateGenre: {
    color: "white",
    fontStyle: "italic",
  },
  star: {
    position: "absolute",
    top: 30,
    right: 10,
    borderRadius: 50,
    backgroundColor: "#F60",
    width: 50,
    height: 50,
    padding: 10,
    paddingTop: 8,
  },
  header: {
    backgroundColor: "#444",
    paddingTop: 15,
    paddingBottom: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: -1,
  },
  panelHandle: {
    alignSelf: "center",
    width: 40,
    height: 10,
    borderRadius: 4,
    backgroundColor: "#0004",
    marginBottom: 8,
  },
  innerContent: {
    height: 700,
    backgroundColor: "#444",
  },
  itemUserLists: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  groupName: {
    width: "90%",
    fontSize: 20,
    color: "white",
    marginTop: 5,
  },
  checkBox: {
    paddingTop: 5,
    width: "7%",
  },
  groupSearch: {
    borderWidth: 2,
    borderColor: "#333333",
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "90%",
    color: "white",
  },
  groupManipulate: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  edit: {
    position: "absolute",
    top: 100,
    right: 10,
    borderRadius: 50,
    backgroundColor: "#F60",
    width: 50,
    height: 50,
    padding: 10,
    paddingTop: 8,
  },
  commentMain: {
    height: 700,
    backgroundColor: "#444",
    alignItems: "center",
  },
  textComment: {
    backgroundColor: "#555",
    width: "95%",
    height: 200,
    textAlignVertical: "top",
    fontSize: 16,
    color: "white",
    borderRadius: 10,
    padding: 10,
  },
});
