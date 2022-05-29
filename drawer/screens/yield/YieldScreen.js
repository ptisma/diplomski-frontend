//third party
import {
  View,
  Text,
  Dimensions,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
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
import { differenceInCalendarYears, format, isDate, parse } from "date-fns";
import { color } from "react-native-reanimated";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
//local
import CustomWheelPicker from "../../../components/WheelPicker/WheelPicker";
import TextInputComponent from "../../../components/TextInput/TextInput";
import {
  ROOT_URL,
  INFLUX_DB_URL,
  INFLUX_DB_TOKEN,
  INFLUX_DB_ORG,
} from "../../../constants/URL";
import DropdownComponent from "../../../components/DropDownComponent/DropDownComponent";

const YieldScreen = ({ navigation }) => {
  // hook to get location from the redux store
  const { location, setLocation } = useSelector(
    (state) => state.location.value
  );
  //state hook for loading spinner
  const [loading, setLoading] = useState(false);
  //state hook for yield data
  const [data, setData] = useState([]);
  //state hook for cultures data
  const [cultures, setCultures] = useState([]);
  //state hook for selected culture
  const [selectedCulture, setSelectedCulture] = useState(null);
  //state hook for showing and rendering graph
  const [showGraph, setShowGraph] = useState(false);
  //state hooks for helper values for graph points
  const [maxYield, setMaxYield] = useState(0);
  const [minYear, setMinYear] = useState(0);
  //state hooks for date pickers
  const [startDate, setStartDate] = useState(new Date(1598051730000));
  const [endDate, setEndDate] = useState(new Date(1598051730000));
  //state hooks for input boxes
  const [startDateStr, setStartDateStr] = useState("");
  const [endDateStr, setEndDateStr] = useState("");

  //function which loads the cultures
  const loadCultures = async () => {
    try {
      console.log(ROOT_URL + "/culture");
      const response = await axios.get(ROOT_URL + "/culture");
      let cultures = response.data;
      console.log(cultures);
      setCultures(cultures);
      /* setCultures([
        {
          id: 1,
          name: "Barley",
        },
        {
          id: 2,
          name: "Maize",
        },
      ]); */
    } catch (error) {
      console.log(error);
    }
  };
  //function which loads the component specific data (yield)
  const loadYield = async () => {
    try {
      //console.log(startDate);
      let start = new Date(parseInt(startDateStr, 10), 0, 1, 1);
      if (isNaN(start)) {
        alert("Wrong starting date format, try YYYY");
        return;
      }
      //console.log(start);
      let end = new Date(parseInt(endDateStr, 10), 0, 1, 1);
      if (isNaN(end)) {
        alert("Wrong starting date format, try YYYY");
        return;
      }
      //console.log(end);
      //console.log(format(start, "yyyyMMdd"));
      //console.log(format(end, "yyyyMMdd"));
      console.log(
        ROOT_URL +
          `/location/${location.id}` +
          `/culture/${selectedCulture.id}` +
          `/yield?from=${format(start, "yyyyMMdd")}&to=${format(
            end,
            "yyyyMMdd"
          )}`
      );
      const response = await axios.get(
        ROOT_URL +
          `/location/${location.id}` +
          `/culture/${selectedCulture.id}` +
          `/yield?from=${format(start, "yyyyMMdd")}&to=${format(
            end,
            "yyyyMMdd"
          )}`
      );

      let yields = response.data;

      /*  let yields = [
        {
          year: 2019,
          yield: 151.32,
        },
        {
          year: 2020,
          yield: 877.1699342461887,
        },
        {
          year: 2021,
          yield: 954.26,
        },
        {
          year: 2022,
          yield: 678.04,
        },
        {
          year: 2023,
          yield: 243.13,
        },
        {
          year: 2024,
          yield: 69.69,
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

  const loadLastSimulation = async () => {
    //console.log(INFLUX_DB_URL, INFLUX_DB_TOKEN, INFLUX_DB_ORG);
    //client for Influx DB
    const fluxQuery = `
      from(bucket:"apsim")
        |> range(start: 0)
        |> filter(fn: (r) => r._measurement == "simulation" and r["location_id"] == "1" and r["culture_id"] == "1" and r["from"] == "2000" and r["to"] == "2002")
        |> sort(columns: ["_time"], desc: true)
        |> first()
        |> group()
    `;
    const url = `${INFLUX_DB_URL}/api/v2/query?orgID=${INFLUX_DB_ORG}`;
    const token = `Token ${INFLUX_DB_TOKEN}`;
    console.log(url);
    console.log(token);

    const headers = {
      Authorization: token,
      Accept: "application/csv",
      "Content-Type": "application/json",
    };
    try {
      const resp = await axios({
        method: "POST",
        url: url,
        data: fluxQuery,
        headers: headers,
      });

      console.log(resp.data);
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("Yield mount");
      loadCultures();
      return () => {
        console.log("Yield unmount");
      };
    }, [])
  );

  //function which handles the get yield button
  const buttonHandler = async (e) => {
    let endDateYear = parseInt(endDateStr, 10);
    let startDateYear = parseInt(startDateStr, 10);
    if (endDateYear - startDateYear > 5 || endDateYear < startDateYear) {
      alert("Maximum allowed interval is 5 years");
      setEndDateStr((endDateYear + 5).toString(10));
    } else {
      try {
        setLoading(true);
        await loadYield();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setShowGraph(true);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
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
      <TextInputComponent
        value={startDateStr}
        setValue={setStartDateStr}
        label={"Starting year of the simulation"}
      />
      <TextInputComponent
        value={endDateStr}
        setValue={setEndDateStr}
        label={"Ending year of the simulation"}
      />

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
          <Text style={styles.label}>History yield in kg/ha per year</Text>
          <Text style={styles.predictedLabel}>
            Predicted yield in kg/ha per year
          </Text>
          <Chart
            style={{ height: styles.chart.height, width: styles.chart.width }}
            padding={{
              left: styles.chart.paddingLeft,
              right: styles.chart.paddingRight,
              top: styles.chart.paddingTop,
              bottom: styles.chart.paddingBottom,
            }}
            data={data}
            xDomain={{ min: 0, max: data.length - 1 }}
            yDomain={{ min: 0, max: Math.ceil(maxYield) }}
          >
            <VerticalAxis
              tickCount={data.length - 1}
              includeOriginTick={false}
              theme={{
                axis: { stroke: { color: "#00BFFF", width: 2 } },
                ticks: { stroke: { color: "#DCDCDC", width: 2 } },
                labels: {
                  label: { color: "#21618C" },
                  formatter: (v) => v.toFixed(2),
                },
              }}
            />
            <HorizontalAxis
              tickCount={data.length - 1}
              includeOriginTick={false}
              theme={{
                axis: { stroke: { color: "#00BFFF", width: 2 } },
                ticks: { stroke: { color: "#DCDCDC", width: 2 } },
                labels: {
                  label: { color: "#21618C" },
                  //find min for 2014
                  formatter: (v) => v + minYear,
                },
              }}
            />
            <Area
              data={data.filter(
                (element) => element.x + minYear <= new Date().getFullYear()
              )}
              theme={historyAreaStyle}
            />
            <Area
              data={data.filter(
                (element) => element.x + minYear >= new Date().getFullYear()
              )}
              theme={predictedAreaStyle}
            />
            <Line
              data={data.filter(
                (element) => element.x + minYear < new Date().getFullYear()
              )}
              theme={historyDataStyle}
            />
            <Line
              data={data.filter(
                (element) => element.x + minYear >= new Date().getFullYear()
              )}
              theme={predictedDataStyle}
            />
          </Chart>
        </View>
      )}
    </ScrollView>
  );
};

export default YieldScreen;

const historyAreaStyle = {
  gradient: {
    from: { color: "#B0E0E6" },
    to: { color: "#4169E1", opacity: 0.4 },
  },
};

const predictedAreaStyle = {
  gradient: {
    from: { color: "#BB8FCE" },
    to: { color: "#7D3C98", opacity: 0.4 },
  },
};

const historyDataStyle = {
  stroke: {
    color: "#E0FFFF",
    width: 3,
    dashArray: [],
  },
  scatter: {
    default: { width: 8, height: 8, rx: 2, color: "#6495ED" },
  },
};

const predictedDataStyle = {
  stroke: {
    color: "#B0E0E6",
    width: 3,
    dashArray: [1, 2, 3, 4],
  },
  scatter: {
    default: { width: 8, height: 8, rx: 2, color: "#6495ED" },
  },
};

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
    height: 200,
    width: "100%",
    paddingLeft: 40,
    paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 20,
  },
  label: {
    textAlign: "center",
    color: "#4169E1",
    marginVertical: 10,
  },
  predictedLabel: {
    textAlign: "center",
    color: "#7D3C98",
    marginVertical: 10,
  },
});
