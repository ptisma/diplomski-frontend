import React from "react";
import { View, Text, Button } from "react-native";

const ChangeLocationScreen = () => {
  return (
    <View>
      <Button
        onPress={buttonPressHandler}
        title="Set up location"
        color="#841584"
        accessibilityLabel="Set up location"
        disabled={isButtonDisabled}
      />
    </View>
  );
};

export default ChangeLocationScreen;
