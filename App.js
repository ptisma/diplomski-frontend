import React from "react";
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
