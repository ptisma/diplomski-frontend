import { View, Text, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { enterLocation } from "../../redux/features/location";
import { Dropdown } from "react-native-element-dropdown";
import { useSelector } from "react-redux";
const DropDownMenu = (props) => {
  //locations as props
  const data = props.locations;

  const [value, setValue] = useState({});
  const [isFocus, setIsFocus] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dispatch = useDispatch();

  const { location, set } = useSelector((state) => state.location.value);
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  const buttonPressHandler = () => {
    dispatch(enterLocation({ set: true, location: value.name }));
    //alert("Submited location");
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="name"
        valueField="name"
        placeholder={!isFocus ? "Select item" : "..."}
        searchPlaceholder="Search..."
        value={value.name}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item);
          setIsFocus(false);
          setIsButtonDisabled(false);
        }}
        renderLeftIcon={() => null}
      />

      <Button
        onPress={buttonPressHandler}
        title="Set up location"
        color="#841584"
        accessibilityLabel="Set up location"
        disabled={isButtonDisabled}
      />
      <Text>{location}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default DropDownMenu;
