import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "react-native-elements";
const DatePicker = ({ setDate, title, min, max }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(1598051730000));
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState("date");

  const onChangeSelectedDate = (event, selectedDate) => {
    if (event.type == "set") {
      const currentDate = selectedDate || selectedDate;
      //setShowStartDate(Platform.OS === "ios");
      setShowPicker(false);
      setSelectedDate(currentDate);
      setDate(currentDate);
    } else {
      setShowPicker(false);
    }
  };

  return (
    <View>
      <View>
        <Button
          onPress={() => {
            setShowPicker(true);
          }}
          title={title}
          buttonStyle={styles.button}
          buttonContainer={styles.buttonContainer}
        />
      </View>
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangeSelectedDate}
          minimumDate={min}
          maximumDate={max}
        />
      )}
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderRadius: 30,
    borderColor: "rgb(39, 39, 39)",
  },
  buttonContainer: {
    marginRight: 50,
  },
});
