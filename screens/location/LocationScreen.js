import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import axios from "axios";
import DropdownComponent from "../../components/DropDownComponent/DropDownComponent";
import { enterLocation } from "../../redux/features/location";
import { Button } from "react-native-elements";
import { ROOT_URL } from "../../constants/URL";

const LocationScreen = ({ navigation }) => {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const loadData = async () => {
    try {
      console.log("Fetching locations");
      const fetchedLocations = await axios.get(ROOT_URL + "/location");
      setLocations(fetchedLocations.data);
      //console.log(fetchedLocations.data);
      /* const fetchedLocations = await axios.get(
        "https://random-data-api.com/api/stripe/random_stripe"
      );
     /*  setLocations([
        {
          id: 1,
          name: "Zagreb",
        },
        {
          id: 2,
          name: "Osijek",
        },
      ]); */
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    //alert("useEffect");
    loadData();
  }, []);

  const buttonHandler = async (e) => {
    setLoading(true);
    await loadData();
    setLoading(false);
    dispatch(enterLocation({ set: true, location: location }));
    //setShowGraph(true);
  };
  return (
    <View style={styles.container}>
      <DropdownComponent
        setSelectedValue={setLocation}
        label={"name"}
        value={"id"}
        data={locations}
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
