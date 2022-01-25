import { View, Text, Dimensions, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button } from "react-native-elements";
import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
  Tooltip,
} from "react-native-responsive-linechart";

import DropdownComponent from "../../../components/DropDownComponent/DropDownComponent";
import { color } from "react-native-reanimated";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { ROOT_URL } from "../../../constants/URL";

const YieldScreen = ({ navigation }) => {
  const { location, setLocation } = useSelector(
    (state) => state.location.value
  );
  const [selectedCulture, setSelectedCulture] = useState(null);
  const [cultures, setCultures] = useState([]);
  const [data, setData] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [loading, setLoading] = useState(false);
  const [maxYield, setMaxYield] = useState(0);
  const [minYear, setMinYear] = useState(0);
  const isFocused = useIsFocused();

  const loadCultures = async () => {
    ///microclimate/all

    try {
      const cultures = await axios.get(ROOT_URL + "/culture/all");
      console.log(cultures.data);
      setCultures(cultures.data);
      /* const cultures = await axios.get(
        "https://random-data-api.com/api/stripe/random_stripe"
      );
      console.log(cultures.data);
      setCultures([
        {
          id: 1,
          name: "Barley",
        },
        {
          id: 2,
          name: "Chickpea",
        },
        {
          id: 3,
          name: "Maize",
        },
        {
          id: 4,
          name: "Oats",
        },
        {
          id: 5,
          name: "Wheat",
        },
      ]); */
    } catch (error) {
      console.log(error);
    }
  };
  const loadYield = async () => {
    try {
      //yield
      /*
    const response = await axios.post("yield", {
      cultureId: selectedCulture.id,
      locationId: location.id,
    });
    */
      const response = await axios.post(ROOT_URL + "/yield", {
        cultureId: selectedCulture.id,
        locationId: location.id,
      });
      let yields = response.data;
      /* const response = await axios.get(
        "https://random-data-api.com/api/stripe/random_stripe"
      );
      let yields = [
        {
          year: 2014,
          yield: 0.0,
        },
        {
          year: 2015,
          yield: 209.455913306975,
        },
        {
          year: 2016,
          yield: 715.477472715902,
        },
        {
          year: 2017,
          yield: 219.35188774028205,
        },
        {
          year: 2018,
          yield: 303.07207523726197,
        },
        {
          year: 2019,
          yield: 277.1699342461887,
        },
        {
          year: 2020,
          yield: 443.90706202782326,
        },
        {
          year: 2021,
          yield: 0.0,
        },
      ]; */
      let first = yields[0].year;
      let maxYield = 0;
      let data = yields.map((e) => {
        if (e.yield > maxYield) maxYield = e.yield;
        return { x: e.year - first, y: e.yield };
      });
      setData(data);
      setMaxYield(maxYield);
      setMinYear(first);
    } catch (error) {
      console.log(error);
    }
  };

  /* useEffect(() => {
    loadCultures();
    //console.log("Yield mount");
    return () => {
      //console.log("Yield unmount");
    };
  }, []); */

  useFocusEffect(
    React.useCallback(() => {
      console.log("Yield mount");
      loadCultures();
      return () => {
        console.log("Yield unmount");
      };
    }, [])
  );

  /*  useFocusEffect(() => {
    loadCultures();
    console.log("Yield mount");
    return () => {
      console.log("Yield unmount");
    };
  }); */

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const buttonHandler = async (e) => {
    setLoading(true);
    /*
    setTimeout(() => {
      setLoading(false);
      test();
      setShowGraph(true);
    }, 2000);
    */
    await loadYield();
    setLoading(false);
    setShowGraph(true);
  };

  return (
    <View style={styles.container}>
      <View>
        <DropdownComponent
          setSelectedValue={setSelectedCulture}
          label={"name"}
          value={"id"}
          data={cultures}
        />
        {/*
           <Text>{selectedCulture !== null && selectedCulture.name}</Text>
        <Text>{location.name}</Text>
          */}
      </View>

      <View>
        <Button
          title="Get yield"
          disabled={selectedCulture === null}
          loading={loading}
          onPress={buttonHandler}
          buttonStyle={styles.button}
        />
      </View>

      {showGraph && (
        <View>
          {/*
            <Text>{Math.ceil(data[data.length - 1].y)}</Text>
            */}

          <Chart
            style={styles.chart}
            data={data}
            padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
            xDomain={{ min: 0, max: data.length - 1 }}
            yDomain={{ min: 0, max: Math.ceil(maxYield) }}
          >
            <VerticalAxis
              tickCount={data.length - 1}
              includeOriginTick={false}
              theme={{
                labels: {
                  label: { color: "#FFF5EE" },
                  formatter: (v) => v.toFixed(1),
                },
              }}
            />
            <HorizontalAxis
              tickCount={data.length - 1}
              includeOriginTick={false}
              theme={{
                labels: {
                  label: { color: "#FFF5EE" },
                  //find min for 2014
                  formatter: (v) => v + minYear,
                },
              }}
            />
            <Area
              theme={{
                gradient: {
                  from: { color: "#B0E0E6" },
                  to: { color: "#4169E1", opacity: 0.4 },
                },
              }}
            />
            <Line
              theme={{
                stroke: { color: "#E0FFFF", width: 3 },
                scatter: {
                  default: { width: 8, height: 8, rx: 2, color: "#6495ED" },
                },
              }}
            />
          </Chart>
        </View>
      )}
    </View>
  );
};

export default YieldScreen;

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

  chart: {
    marginTop: 50,
    height: 300,
    width: "100%",
  },
});
