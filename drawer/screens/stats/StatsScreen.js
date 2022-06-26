//third party
import {
  View,
  Text,
  Dimensions,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "react-native-elements";
import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
  Tooltip,
} from "react-native-responsive-linechart";
import Modal from "react-native-modal";
import {
  format,
  differenceInDays,
  addDays,
  parseISO,
  add,
  formatISO,
  parse,
  isBefore,
  isAfter,
} from "date-fns";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
//local
import DatePicker from "../../../components/DateTimePicker/DatePicker";
import { ROOT_URL } from "../../../constants/URL";
import DropdownComponent from "../../../components/DropDownComponent/DropDownComponent";
import useTimePeriod from "../../../hooks/period";
import { isEqual, isSameDay } from "date-fns/esm";
import useDataApi from "../../../hooks/graph";
import useParameters from "../../../hooks/parameters";
import { tr } from "date-fns/locale";

const StatsScreen = ({ navigation }) => {
  // hook to get location from the redux store
  const { location, set } = useSelector((state) => state.location.value);
  //state hook for loading spinner
  const [loading, setLoading] = useState(false);

  //state hook for selected microclimate parameter
  const [parameter, setParameter] = useState({});
  // //state hook for showing and rendering graph
  const [showGraph, setShowGraph] = useState(false);

  //hook for is screen currently displayed
  const isFocused = useIsFocused();
  //hook for time period from API(mix and max date)
  const [period, periodError] = useTimePeriod(location.id, isFocused);
  //hook for microclimate parmameters from API
  const [parameters, parametersError] = useParameters(isFocused);

  //state hooks for selected dates
  const [startDate, setStartDate] = useState(new Date(2022, 5));
  const [endDate, setEndDate] = useState(new Date(2022, 5));

  //state hook for showing modal
  const [isModalVisible, setModalVisible] = useState(false);

  //hook for the data in [{date:"YYYY-MM-DD", value:float32}] format and {max:float32, min:float32}
  //last element of historyData is also the first element in predictedData because of graph points
  const [historyData, predictedData, value, minDate, isError, fetchPoints] =
    useDataApi(
      ROOT_URL +
        `/location/${location.id}` +
        `/microclimate/${parameter.id}?from=${format(
          startDate,
          "yyyyMMdd"
        )}&to=${format(endDate, "yyyyMMdd")}`
    );

  //function which sets the modal visible
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useFocusEffect(
    React.useCallback(() => {
      //console.log("Stats focus");
      //loadParameters();
      //loadData();
      //loadPeriod();
      return () => {
        //console.log("Stats unfocus");
      };
    }, [])
  );

  useEffect(() => {
    //console.log("Stats mount");
    return () => {};
  }, []);

  // //function which handles the get stats button
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
    //console.log(startDate, endDate);
    setLoading(true);
    //await loadData();
    await fetchPoints();
    setLoading(false);
    setShowGraph(true);
  };

  //track errors and pass them to subcomponents as args
  useEffect(() => {
    if (parametersError) {
      alert("Error fetching parameters from API");
    }
    if (periodError) {
      alert("Error fetching period from API");
    }
    if (isError) {
      alert("Error fetching microclimate readings from API");
    }
  }, [parametersError, periodError, isError]);

  return (
    <View style={styles.container}>
      <DropdownComponent
        setSelectedValue={setParameter}
        label={"name"}
        value={"id"}
        data={parameters}
        isError={parametersError}
      />
      <DatePicker
        setDate={setStartDate}
        title={"Start of the interval"}
        min={parseISO(period.min)}
        max={parseISO(period.max)}
        disabled={periodError}
        isError={periodError}
      />

      <DatePicker
        setDate={setEndDate}
        title={"End of the interval"}
        min={parseISO(period.min)}
        max={parseISO(period.max)}
        isError={periodError}
      />
      <Button
        title="Get stats"
        disabled={Object.keys(parameter).length === 0}
        loading={loading}
        onPress={buttonHandler}
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
      />
      {isError ? (
        <View>
          <Text style={styles.errorLabel}>Greska</Text>
        </View>
      ) : (
        showGraph && (
          <View>
            <Text
              style={styles.label}
            >{`Values in ${parameter.unit} per day for ${parameter.name}`}</Text>
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
              viewport={{ size: { width: 3 } }}
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
                    label: { color: "#21618C", rotation: 0 },
                    formatter: (v) => format(addDays(minDate, v), "yyyy-MM-dd"),
                  },
                }}
              />
              {historyData.length > 0 && (
                <View>
                  <Area data={historyData} theme={historyAreaStyle} />
                  <Line data={historyData} theme={historyDataStyle} />
                </View>
              )}

              {predictedData.length > 0 && (
                <View>
                  <Area data={predictedData} theme={predictedAreaStyle} />
                  <Line data={predictedData} theme={predictedDataStyle} />
                </View>
              )}
            </Chart>
            <Button
              title="Show more"
              onPress={toggleModal}
              disabled={!showGraph}
              buttonStyle={styles.modalButton}
            />
            <Modal isVisible={isModalVisible} backdropOpacity={0.9}>
              <View style={styles.modalContainer}>
                {parameter !== null && (
                  <Text style={styles.modalLabel}>
                    {`Values for parameter ${parameter.name} from ${format(
                      startDate,
                      "yyyy-MM-dd"
                    )} to ${format(endDate, "yyyy-MM-dd")} in ${
                      parameter.unit
                    } per year`}
                  </Text>
                )}
                <View>
                  <Chart
                    style={{
                      height: styles.chart.height,
                      width: styles.chart.width,
                    }}
                    padding={{
                      left: styles.chart.paddingLeft,
                      bottom: styles.chart.paddingBottom,
                      right: styles.chart.paddingRight,
                      top: styles.chart.paddingTop,
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
                      includeOriginTick={false}
                      theme={{
                        axis: { stroke: { color: "#00BFFF", width: 2 } },
                        ticks: { stroke: { color: "#DCDCDC", width: 2 } },
                        labels: {
                          label: { color: "#FFF5EE" },
                          formatter: (v) => v.toFixed(2),
                        },
                      }}
                    />
                    <HorizontalAxis
                      tickCount={5}
                      theme={{
                        axis: { stroke: { color: "#00BFFF", width: 2 } },
                        ticks: { stroke: { color: "#DCDCDC", width: 2 } },
                        labels: {
                          label: { color: "#FFF5EE", rotation: 0 },
                          formatter: (v) =>
                            format(addDays(minDate, v), "yyyy-MM-dd"),
                        },
                      }}
                    />
                    {historyData.length > 0 && (
                      <View>
                        <Area data={historyData} theme={historyAreaStyle} />
                        <Line data={historyData} theme={historyDataStyle} />
                      </View>
                    )}

                    {predictedData.length > 0 && (
                      <View>
                        <Area data={predictedData} theme={predictedAreaStyle} />
                        <Line data={predictedData} theme={predictedDataStyle} />
                      </View>
                    )}
                  </Chart>
                </View>
                <Button title="Hide more" onPress={toggleModal} />
              </View>
            </Modal>
          </View>
        )
      )}
    </View>
  );
};

export default StatsScreen;

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
    display: "flex",
    flexDirection: "column",
    padding: 10,
  },
  modalContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  button: {
    borderWidth: 2,
    borderRadius: 30,
    borderColor: "rgb(39, 39, 39)",
  },
  modalButton: {
    marginTop: 20,
  },
  buttonContainer: {
    marginHorizontal: 100,
    marginVertical: 10,
  },
  customBackdrop: {
    flex: 1,
    backgroundColor: "#87BBE0",
    alignItems: "center",
  },
  customBackdropText: {
    marginTop: 10,
    fontSize: 17,
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
    marginBottom: 20,
  },
  modalLabel: {
    textAlign: "center",
    color: "#4169E1",
  },
  errorLabel: {
    textAlign: "center",
    color: "red",
    marginVertical: 10,
  },
});
