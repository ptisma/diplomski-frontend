import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Main from "./Main";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./redux/features/location";
const store = configureStore({
  reducer: {
    location: locationReducer,
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
