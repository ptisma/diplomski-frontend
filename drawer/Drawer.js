import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useSelector } from "react-redux";
//
import StatsScreen from "./screens/stats/StatsScreen";
import CultureScreen from "./screens/yield/YieldScreen";
import { useDispatch } from "react-redux";
import { enterLocation } from "../redux/features/location";
import GainsScreen from "./screens/gains/GainsScreen";
import GddScreen from "./screens/gdd/GddScreen";

const DrawerContainer = createDrawerNavigator();

const Drawer = ({ navigation }) => {
  const dispatch = useDispatch();
  const { location, set } = useSelector((state) => state.location.value);

  return (
    <DrawerContainer.Navigator
      initialRouteName="Stats"
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <Button
              title="Stats"
              onPress={() => props.navigation.navigate("Stats")}
            />
            <Button
              title="Yield"
              onPress={() => props.navigation.navigate("Culture")}
            />

            <Button
              title="Growing degree day"
              onPress={() => props.navigation.navigate("GDD")}
            />
            <Button
              title="Change location"
              onPress={() =>
                dispatch(enterLocation({ location: "", set: false }))
              }
            />
          </DrawerContentScrollView>
        );
      }}
    >
      <DrawerContainer.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          headerRight: (props) => (
            <Text style={styles.headerRight}>{location.name}</Text>
          ),
        }}
      />
      <DrawerContainer.Screen
        name="Culture"
        component={CultureScreen}
        options={{
          headerRight: (props) => (
            <Text style={styles.headerRight}>{location.name}</Text>
          ),
          headerTitle: "Yield",
        }}
      />

      <DrawerContainer.Screen
        name="GDD"
        component={GddScreen}
        options={{
          headerRight: (props) => (
            <Text style={styles.headerRight}>{location.name}</Text>
          ),
        }}
      />
    </DrawerContainer.Navigator>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  headerRight: {
    paddingRight: 20,
    fontWeight: "bold",
  },
});
