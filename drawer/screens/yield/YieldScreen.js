//third party
import {
  View,
  Text,
  Dimensions,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import {
  addDays,
  addYears,
  differenceInCalendarYears,
  differenceInYears,
  format,
  isBefore,
  isDate,
  parse,
  parseISO,
} from "date-fns";
import { color } from "react-native-reanimated";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
//local
import TextInputComponent from "../../../components/TextInput/TextInput";
import { ROOT_URL } from "../../../constants/URL";
import DropdownComponent from "../../../components/DropDownComponent/DropDownComponent";

import useTimePeriod from "../../../hooks/period";
import useCultures from "../../../hooks/cultures";
import useDataYearApi from "../../../hooks/yearValue";
import { isAfter } from "date-fns/esm";

const YieldScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  // hook to get location from the redux store
  const { location, setLocation } = useSelector(
    (state) => state.location.value
  );
  //state hook for loading spinner
  const [loading, setLoading] = useState(false);
  //state hook for yield data
  // const [data, setData] = useState([]);
  //state hook for cultures data
  // const [cultures, setCultures] = useState([]);
  const [cultures, culturesError] = useCultures(isFocused);
  //state hook for selected culture
  const [culture, setCulture] = useState({});
  //state hook for showing and rendering graph
  const [showGraph, setShowGraph] = useState(false);
  //state hooks for helper values for graph points
  // const [maxYield, setMaxYield] = useState(0);
  // const [minYear, setMinYear] = useState(0);
  //state hooks for date pickers
  const [startDate, setStartDate] = useState(new Date(1598051730000));
  const [endDate, setEndDate] = useState(new Date(1598051730000));
  //state hooks for input boxes
  const [startDateStr, setStartDateStr] = useState("");
  const [endDateStr, setEndDateStr] = useState("");
  const [period, periodError] = useTimePeriod(location.id, isFocused);

  const [
    historyData,
    predictedData,
    maxValue,
    minYear,
    metadata,
    isError,
    fetchPoints,
  ] = useDataYearApi(
    ROOT_URL +
      `/location/${location.id}` +
      `/culture/${culture.id}/yield?from=${format(
        startDate,
        "yyyyMMdd"
      )}&to=${format(endDate, "yyyyMMdd")}`
  );

  useFocusEffect(
    React.useCallback(() => {
      //console.log("Yield focus");
      // loadCultures();
      return () => {
        //console.log("Yield unfocus");
      };
    }, [])
  );

  //useEffect hook which gets updated as the input of startYear changes, if its valid format its going to set state for start date
  useEffect(() => {
    setStartDate(new Date());
    //console.log(startDateStr);
    if (startDateStr.length === 4) {
      let startDateParsed = parseISO(startDateStr);
      //console.log(startDateParsed);
      if (isDate(startDateParsed)) {
        //console.log("settting startDateStr");
        setStartDate(startDateParsed);
      }
    }
  }, [startDateStr]);

  //useEffect hook which gets updated as the input of endYear changes, if its valid format its going to set state for end date
  useEffect(() => {
    setEndDate(new Date());
    //console.log(endDateStr);
    if (endDateStr.length === 4) {
      let endDateParsed = parseISO(endDateStr);
      //console.log(endDateParsed);
      if (isDate(endDateParsed)) {
        //console.log("settting endDateStr");
        endDateParsed = addDays(endDateParsed, 364);
        setEndDate(endDateParsed);
      }
    }
  }, [endDateStr]);

  useEffect(() => {
    if (culturesError) {
      alert("Error fetching cultures from API");
    }
    if (periodError) {
      alert("Error fetching period from API");
    }
    if (isError) {
      alert("Error fetching microclimate readings from API");
    }
  }, [culturesError, periodError, isError]);

  //function which handles the get yield button
  const buttonHandler = async (e) => {
    //console.log("In button handler");

    let starteDateParsed = parseISO(startDateStr);
    let endDateParsed = parseISO(endDateStr);

    let min = parseISO(period.min);
    let max = parseISO(period.max);

    if (!isDate(starteDateParsed) || !isDate(endDateParsed)) {
      alert("Use YYYY format for start or end date ");
      return;
    }

    if (
      isBefore(starteDateParsed, min) ||
      isAfter(starteDateParsed, max) ||
      isAfter(endDateParsed, max) ||
      isBefore(endDateParsed, min)
    ) {
      alert(
        `Min year is ${min.getFullYear()}, max year is ${max.getFullYear()}`
      );
      return;
    }
    if (!isBefore(starteDateParsed, endDateParsed)) {
      alert("Start date has to be before end date");
      return;
    }

    if (differenceInYears(endDateParsed, starteDateParsed) > 5) {
      alert("Maximum allowed interval is 5 years");
      return;
    }

    setLoading(true);
    await fetchPoints();
    setLoading(false);
    setShowGraph(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View></View>
      <View></View>

      <View>
        <DropdownComponent
          setSelectedValue={setCulture}
          label={"name"}
          value={"id"}
          data={cultures}
          isError={culturesError}
        />
      </View>
      <TextInputComponent
        value={startDateStr}
        setValue={setStartDateStr}
        label={"Starting year of the simulation"}
        isError={periodError}
      />
      <TextInputComponent
        value={endDateStr}
        setValue={setEndDateStr}
        label={"Ending year of the simulation"}
        isError={periodError}
      />

      <View>
        <Button
          title="Get yield"
          disabled={Object.keys(culture).length === 0}
          loading={loading}
          onPress={buttonHandler}
          buttonStyle={styles.button}
        />
      </View>
      {isError ? (
        <View>
          <Text style={styles.errorLabel}>Greska</Text>
        </View>
      ) : (
        showGraph && (
          <View>
            {historyData.length > 0 && (
              <Text style={styles.label}>History yield in kg/ha per year</Text>
            )}

            {predictedData.length > 0 && (
              <Text style={styles.predictedLabel}>
                Predicted yield in kg/ha per year
              </Text>
            )}

            <Chart
              style={{ height: styles.chart.height, width: styles.chart.width }}
              padding={{
                left: styles.chart.paddingLeft,
                right: styles.chart.paddingRight,
                top: styles.chart.paddingTop,
                bottom: styles.chart.paddingBottom,
              }}
              xDomain={{
                min: 0,
                max:
                  predictedData.length > 0
                    ? historyData.length > 0
                      ? historyData.length + predictedData.length - 2
                      : predictedData.length - 1
                    : historyData.length - 1,
              }}
              yDomain={{ min: 0, max: 1 * Math.ceil(maxValue) }}
            >
              <VerticalAxis
                tickCount={
                  predictedData.length > 0
                    ? historyData.length > 0
                      ? historyData.length + predictedData.length - 1
                      : predictedData.length
                    : historyData.length
                }
                includeOriginTick={true}
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
                tickCount={
                  predictedData.length > 0
                    ? historyData.length > 0
                      ? historyData.length + predictedData.length - 1
                      : predictedData.length
                    : historyData.length
                }
                includeOriginTick={true}
                theme={{
                  axis: { stroke: { color: "#00BFFF", width: 2 } },
                  ticks: { stroke: { color: "#DCDCDC", width: 2 } },
                  labels: {
                    label: { color: "#21618C" },
                    //find min for 2014
                    formatter: (v) => minYear + v,
                  },
                }}
              />
              {historyData.length > 0 && (
                <View>
                  <Area data={historyData} theme={historyAreaStyle} />
                  <Line
                    data={historyData}
                    theme={historyDataStyle}
                    tooltipComponent={
                      <Tooltip
                        theme={{
                          shape: { width: 50 },
                          formatter: ({ y }) => y.toFixed(0),
                        }}
                      />
                    }
                  />
                </View>
              )}
              {predictedData.length > 0 && (
                <View>
                  <Area data={predictedData} theme={predictedAreaStyle} />
                  <Line
                    data={predictedData}
                    theme={predictedDataStyle}
                    tooltipComponent={
                      <Tooltip
                        theme={{
                          shape: { width: 50 },
                          formatter: ({ y }) => y.toFixed(0),
                        }}
                      />
                    }
                  />
                </View>
              )}
            </Chart>
          </View>
        )
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
  container: { display: "flex", flexDirection: "column", padding: 10 },
  button: {
    borderWidth: 2,
    borderRadius: 30,
    borderColor: "rgb(39, 39, 39)",
    paddingVertical: 10,
    marginVertical: 20,
  },

  chart: {
    height: 200,
    width: "100%",
    paddingLeft: 40,
    paddingRight: 30,
    paddingTop: 30,
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
  errorLabel: {
    textAlign: "center",
    color: "red",
    marginVertical: 10,
  },
});
