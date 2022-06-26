import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import axios from "axios";
//
import DropdownComponent from "../../components/DropDownComponent/DropDownComponent";
import { enterLocation } from "../../redux/features/location";
import { Button } from "react-native-elements";
import { ROOT_URL } from "../../constants/URL";
import useLocations from "../../hooks/locations";

const LocationScreen = ({ navigation }) => {
  // const [locationsError, setLocationsError] = useState(true);
  // const [locations, setLocations] = useState([]);
  const [locations, locationsError] = useLocations();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  //move this functionality to custom hook
  // const loadData = async () => {
  //   try {
  //     //console.log("Fetching locations");
  //     //console.log(ROOT_URL + "/location");
  //     const fetchedLocations = await axios.get(ROOT_URL + "/location");
  //     //console.log(fetchedLocations);
  //     setLocations(fetchedLocations.data);
  //     setLocationsError(false);
  //   } catch (error) {
  //     setLocationsError(true);
  //     console.log(error);
  //   }
  // };
  useEffect(() => {
    //console.log("Mounted LocationScreen");
    // loadData();
    return () => {};
  }, []);

  const buttonHandler = async (e) => {
    setLoading(true);
    // await loadData();
    dispatch(enterLocation({ set: true, location: location }));
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <DropdownComponent
        setSelectedValue={setLocation}
        label={"name"}
        value={"id"}
        data={locations}
        isError={locationsError}
      />
      <View>
        <Button
          title="Set a location"
          disabled={location === null}
          loading={loading}
          onPress={buttonHandler}
          buttonStyle={styles.button}
          containerStyle={styles.container}
        />
      </View>
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 10,
  },
  button: {
    borderWidth: 2,
    borderRadius: 30,
    borderColor: "rgb(39, 39, 39)",
  },
  buttonContainer: {
    marginHorizontal: 100,
    marginVertical: 10,
  },
});
