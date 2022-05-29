import React, { useState } from "react";
import { StyleSheet } from "react-native";
import WheelPicker from "react-native-wheely";

const CustomWheelPicker = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const data = Array.from(Array(10).keys());

  return (
    <WheelPicker
      selectedIndex={selectedIndex}
      options={data}
      onChange={(index) => setSelectedIndex(index)}
      containerStyle={styles.container}
      itemStyle={styles.itemStyle}
    />
  );
};

export default CustomWheelPicker;

const styles = StyleSheet.create({
  container: {},
  selectedItem: {},
  itemStyle: {},
});
