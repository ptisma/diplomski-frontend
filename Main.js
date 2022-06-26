import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
//
import LocationScreen from "./screens/location/LocationScreen";
import Drawer from "./drawer/Drawer";

const Stack = createNativeStackNavigator();
const Main = () => {
  const { location, set } = useSelector((state) => state.location.value);
  const scheme = useColorScheme();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {},
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {set == false ? (
          // Location not set
          <Stack.Screen
            name="Location"
            component={LocationScreen}
            options={{
              title: "Locations",
            }}
          />
        ) : (
          // Location is set
          <Stack.Screen
            name="Drawer"
            component={Drawer}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  global: {
    backgroundColor: "red",
  },
});

export default Main;
