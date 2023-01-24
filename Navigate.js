import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./components/Main";
import Film from "./components/Film";
import ListOfFilms from "./components/ListOfFilms";
import Login from "./components/Login";

const Stack = createStackNavigator();

export default function Navigate() {
  const mainOptions = {
    headerStyle: { backgroundColor: "#F60", height: 80 },
    headerTitleStyle: {
      fontWeight: "700",
      color: "#333",
      fontSize: 20,
    },
    title: "Popular films",
    justifyContent: "space-around",
    headerTitleAlign: "left",
  };
  const filmOptions = {
    headerShown: false,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={ {headerShown : false }}/>
        <Stack.Screen name="Main" component={Main} options={mainOptions} />
        <Stack.Screen name="Film" component={Film} options={filmOptions} />
        <Stack.Screen
          name="ListOfFilms"
          component={ListOfFilms}
          options={filmOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
