//third party
import { StyleSheet, Text, View, Alert } from "react-native";
import { Button } from "react-native-elements";
import React, { useEffect, useState } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  format,
  differenceInDays,
  addDays,
  parseISO,
  add,
  formatISO,
  isBefore,
} from "date-fns";
import { useSelector } from "react-redux";
import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
  Tooltip,
} from "react-native-responsive-linechart";
//local
import DatePicker from "../../../components/DateTimePicker/DatePicker";
import DropdownComponent from "../../../components/DropDownComponent/DropDownComponent";
import useTimePeriod from "../../../hooks/period";
import useCultures from "../../../hooks/cultures";
import useDataApi from "../../../hooks/graph";
import { ROOT_URL } from "../../../constants/URL";

const GddScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  // hook to get location from the redux store
  const { location, set } = useSelector((state) => state.location.value);
  //state hook for loading spinner
  const [loading, setLoading] = useState(false);
  //state hook for gdd data
  // const [data, setData] = useState([]);

  //state hook for accumulated gdd data
  const [historyAccumulatedData, setHistoryAccumulatedData] = useState([]);
  const [predictedAccumulatedData, setPredictedAccumulatedData] = useState([]);

  //state hook for cultures data
  // const [cultures, setCultures] = useState([]);
  const [cultures, culturesError] = useCultures(isFocused);
  //state hook for selected culture
  const [culture, setCulture] = useState({});
  //state hook for showing and rendering graph
  const [showGraph, setShowGraph] = useState(false);

  //state hook for time period from API(mix and max date)
  // const [period, setPeriod] = useState({});
  const [period, periodError] = useTimePeriod(location.id, isFocused);
  //state hooks for date pickers
  const [startDate, setStartDate] = useState(new Date(1598051730000));
  const [endDate, setEndDate] = useState(new Date(1598051730000));

  //state hooks for helper values for graph points
  // const [maxValue, setMaxValue] = useState(0);
  const [accumulatedValue, setAccumulatedValue] = useState({ max: 0, min: 0 });
  // const [minDate, setMinDate] = useState(null);

  const [historyData, predictedData, value, minDate, isError, fetchPoints] =
    useDataApi(
      ROOT_URL +
        `/location/${location.id}` +
        `/culture/${culture.id}/gdd?from=${format(
          startDate,
          "yyyyMMdd"
        )}&to=${format(endDate, "yyyyMMdd")}`
    );

  //calculated accumulated data every time data is fetched
  useEffect(() => {
    //console.log("UseEffect accumulated data");
    let historyAccData = [];
    let predictedAccData = [];
    let maxValue = Number.MIN_VALUE;
    let minValue = Number.MAX_VALUE;

    let currentSum = 0;
    historyAccData = historyData.map((e) => {
      currentSum = e.y + currentSum;
      if (currentSum > maxValue) maxValue = currentSum;
      if (currentSum < minValue) minValue = currentSum;
      return {
        x: e.x,
        y: currentSum,
      };
    });
    predictedAccData = predictedData.map((e, i) => {
      //case when we have both lengths > 0
      //last member of historyData and first member of predictedData are same
      //we won't sum the same element twice so we return a first
      if (historyAccData.length > 0 && i === 0) {
        return {
          x: e.x,
          y: currentSum,
        };
      }
      currentSum = e.y + currentSum;
      if (currentSum > maxValue) maxValue = currentSum;
      if (currentSum < minValue) minValue = currentSum;
      return {
        x: e.x,
        y: currentSum,
      };
    });

    setAccumulatedValue({ max: maxValue, min: minValue });
    setHistoryAccumulatedData(historyAccData);
    setPredictedAccumulatedData(predictedAccData);
    //setMaxAccumulatedValue(maxValue);
    // console.log(
    //   historyAccumulatedData,
    //   predictedAccumulatedData,
    //   accumulatedValue
    // );

    // console.log("historyData:", historyData);
    // console.log("predictedData:", predictedData);
    // console.log("historyAccData:", historyAccData);
    // console.log("predictedAccData:", predictedAccData);

    return () => {};
  }, [historyData, predictedData]);

  //track errors and pass them to subcomponents as args
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

  //function which handles the get gdd button
  const buttonHandler = async (e) => {
    //console.log("In button handler");
    //alert(differenceInDays(startDate, endDate));
    if (!isBefore(startDate, endDate)) {
      alert("Start date has to be before end date");
      return;
    }

    if (differenceInDays(endDate, startDate) > 29) {
      alert("Maximum allowed interval is 30 days");
      return;
      //setEndDate(addDays(startDate, 30));
    }
    if (differenceInDays(endDate, startDate) < 4) {
      alert("Minimum allowed interval is 5 days");
      return;
      //setEndDate(addDays(startDate, 30));
    }
    setLoading(true);
    //await loadData();
    await fetchPoints();
    //console.log("over fetching");
    setLoading(false);
    setShowGraph(true);
  };

  //function which transforms the array of growing degree days to accumulated growing degree days
  const accumulatedGDD = () => {
    let currentSum = 0;
    let accumulatedData = data.map((e) => {
      currentSum = e.y + currentSum;
      return {
        x: e.x,
        y: currentSum,
      };
    });
    return accumulatedData;
  };

  const test = () => {
    let test = data
      .filter((value, index, array) => {
        return index % 8 == 0;
      })
      .map((e) => e.x);
    console.log("test");
    return test;
  };

  //hook which uses the load functions every time component is mounted on screen
  useFocusEffect(
    React.useCallback(() => {
      //console.log("GDD mount");
      //loadCultures();
      //loadData();
      //loadPeriod();
      return () => {
        //console.log("GDD unmount");
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <View>
        <DropdownComponent
          setSelectedValue={setCulture}
          label={"name"}
          value={"id"}
          data={cultures}
          isError={culturesError}
        />
      </View>

      <DatePicker
        setDate={setStartDate}
        title={"Start of the interval"}
        min={parseISO(period.min)}
        max={parseISO(period.max)}
        isError={periodError}
      />

      <View>
        <DatePicker
          setDate={setEndDate}
          title={"End of the interval"}
          min={parseISO(period.min)}
          max={parseISO(period.max)}
          isError={periodError}
        />
      </View>

      <View>
        <Button
          title="Get growing degree day"
          disabled={Object.keys(culture).length === 0}
          loading={loading}
          onPress={buttonHandler}
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
        />
      </View>
      {isError ? (
        <View>
          <Text style={styles.errorLabel}>Error</Text>
        </View>
      ) : (
        showGraph && (
          <View>
            <Text style={styles.label}>Growing degree days(°C)</Text>
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
              yDomain={{
                min: value.min,
                max: value.max,
              }}
            >
              <VerticalAxis
                tickCount={5}
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
                tickCount={5}
                includeOriginTick={true}
                theme={{
                  axis: { stroke: { color: "#00BFFF", width: 2 } },
                  ticks: { stroke: { color: "#DCDCDC", width: 2 } },
                  labels: {
                    label: { color: "#21618C", rotation: 0 },
                    formatter: (v) => format(addDays(minDate, v), "yyyy-MM-dd"),
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
                      <Tooltip theme={{ formatter: ({ y }) => y.toFixed(2) }} />
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
                      <Tooltip theme={{ formatter: ({ y }) => y.toFixed(2) }} />
                    }
                  />
                </View>
              )}
            </Chart>
            <Text style={styles.label}>
              Accumulated growing degree days(°C)
            </Text>
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
              yDomain={{
                min: accumulatedValue.min,
                max: accumulatedValue.max,
              }}
            >
              <VerticalAxis
                tickCount={5}
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
                tickCount={5}
                includeOriginTick={true}
                theme={{
                  axis: { stroke: { color: "#00BFFF", width: 2 } },
                  ticks: { stroke: { color: "#DCDCDC", width: 2 } },
                  labels: {
                    label: { color: "#21618C", rotation: 0 },
                    formatter: (v) => format(addDays(minDate, v), "yyyy-MM-dd"),
                  },
                }}
              />
              {historyAccumulatedData.length > 0 && (
                <View>
                  <Area
                    data={historyAccumulatedData}
                    theme={historyAreaStyle}
                  />
                  <Line
                    data={historyAccumulatedData}
                    theme={historyDataStyle}
                    tooltipComponent={
                      <Tooltip theme={{ formatter: ({ y }) => y.toFixed(2) }} />
                    }
                  />
                </View>
              )}

              {predictedAccumulatedData.length > 0 && (
                <View>
                  <Area
                    data={predictedAccumulatedData}
                    theme={predictedAreaStyle}
                  />
                  <Line
                    data={predictedAccumulatedData}
                    theme={predictedDataStyle}
                    tooltipComponent={
                      <Tooltip theme={{ formatter: ({ y }) => y.toFixed(2) }} />
                    }
                  />
                </View>
              )}
            </Chart>
          </View>
        )
      )}
    </View>
  );
};

export default GddScreen;

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
    marginHorizontal: 90,
    marginVertical: 10,
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
  },
  errorLabel: {
    textAlign: "center",
    color: "red",
    marginVertical: 10,
  },
});
