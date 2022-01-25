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
import DropdownComponent from "../../../components/DropDownComponent/DropDownComponent";
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
} from "date-fns";
import DatePicker from "../../../components/DateTimePicker/DatePicker";
import { ROOT_URL } from "../../../constants/URL";

const StatsScreen = ({ navigation }) => {
  const { location, set } = useSelector((state) => state.location.value);
  const [parameters, setParameters] = useState([]);
  const [period, setPeriod] = useState({});
  const [parameter, setParameter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState([]);
  const [test1, setTest1] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [minDate, setMinDate] = useState(null);

  const [startDate, setStartDate] = useState(new Date(1598051730000));
  const [endDate, setEndDate] = useState(new Date(1598051730000));
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [mode, setMode] = useState("date");

  //
  //modal
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  //
  const loadParameters = async () => {
    try {
      const parameters = await axios.get(ROOT_URL + "/microclimate/all");
      setParameters(parameters.data);
      /* const parameters = await axios.get("https://random-data-api.com/api/stripe/random_stripe");
    setParameters([
      {
        id: 1,
        name: "Radiation",
      },
      {
        id: 2,
        name: "Maximum temperature",
      },
      {
        id: 3,
        name: "Minimum temperature",
      },
      {
        id: 4,
        name: "Rain",
      },
      {
        id: 5,
        name: "Wind",
      },
    ]); */
    } catch (error) {}
    ///microclimate/all
  };

  const loadPeriod = async () => {
    try {
      const timePeriod = await axios.get(
        ROOT_URL + "/microclimate/time-period"
      );
      console.log(timePeriod.data);
      setPeriod(timePeriod.data);
      /* const data = await axios.get(
      "https://random-data-api.com/api/stripe/random_stripe"
    );
    setPeriod({
      max: "2021-01-01",
      min: "2014-12-31",
    }); */
      //set defaults for intervals
    } catch (error) {
      console.log(error);
    }
    //microclimate/ time-period
  };

  const test = async () => {
    ///microclimate/{i_mikroklimatskog_parametra}
    const response = axios.post(`/${parameter}`, {
      from: format(startDate, "yyyy-mm-dd"),
      to: format(endDate, "yyyy-mm-dd"),
      locationId: location.id,
    });
    setTest1([
      {
        date: "2014-12-31",
        value: 6.800000190734863,
      },

      //objects.map(elem => console.log(elem.date))
    ]);
  };

  const loadData = async () => {
    try {
      /*
    const lista = Array.from({ length: 100 }, () => {
      return { x: Math.random() * 500, y: Math.random() * 15 };
    });
    */
      /*
    {
    "from": "2014-12-31",
    "to": "2015-01-31",
    "locationId": 2
}
    */
      /* console.log(root + "/microclimate" + `/${parameter.id}`);
    console.log(startDate.toISOString(), endDate.toISOString());
    console.log(formatISO(startDate, "yyyy-mm-dd"));
    console.log({
      from: format(startDate, "yyyy-mm-dd"),
      to: format(endDate, "yyyy-mm-dd"),
      locationId: location.id,
    }); */
      const rez = await axios.post(
        ROOT_URL + "/microclimate" + `/${parameter.id}`,
        {
          from: formatISO(startDate, "yyyy-mm-dd"),
          to: formatISO(endDate, "yyyy-mm-dd"),
          locationId: location.id,
        }
      );
      const values = rez.data;
      console.log(values);
      //console.log(values.data)
      /* const fetchedLocations = await axios.get("https://random-data-api.com/api/stripe/random_stripe");
    const values = [
      {
        date: "2014-12-31",
        value: 6.800000190734863,
      },
      {
        date: "2015-01-01",
        value: 3.0,
      },
      {
        date: "2015-01-02",
        value: 3.5,
      },
      {
        date: "2015-01-03",
        value: 4.400000095367432,
      },
      {
        date: "2015-01-04",
        value: 5.699999809265137,
      },
      {
        date: "2015-01-05",
        value: 5.099999904632568,
      },
      {
        date: "2015-01-06",
        value: 6.699999809265137,
      },
      {
        date: "2015-01-07",
        value: 4.800000190734863,
      },
      {
        date: "2015-01-08",
        value: 3.0999999046325684,
      },
      {
        date: "2015-01-09",
        value: 4.5,
      },
      {
        date: "2015-01-10",
        value: 4.300000190734863,
      },
      {
        date: "2015-01-11",
        value: 4.099999904632568,
      },
      {
        date: "2015-01-12",
        value: 7.0,
      },
      {
        date: "2015-01-13",
        value: 8.0,
      },
      {
        date: "2015-01-14",
        value: 7.400000095367432,
      },
      {
        date: "2015-01-15",
        value: 7.800000190734863,
      },
      {
        date: "2015-01-16",
        value: 7.599999904632568,
      },
      {
        date: "2015-01-17",
        value: 4.0,
      },
      {
        date: "2015-01-18",
        value: 1.899999976158142,
      },
      {
        date: "2015-01-19",
        value: 2.299999952316284,
      },
      {
        date: "2015-01-20",
        value: 2.4000000953674316,
      },
      {
        date: "2015-01-21",
        value: 2.799999952316284,
      },
      {
        date: "2015-01-22",
        value: 3.0,
      },
      {
        date: "2015-01-23",
        value: 1.899999976158142,
      },
      {
        date: "2015-01-24",
        value: 2.4000000953674316,
      },
      {
        date: "2015-01-25",
        value: 2.299999952316284,
      },
      {
        date: "2015-01-26",
        value: 3.9000000953674316,
      },
      {
        date: "2015-01-27",
        value: 2.0999999046325684,
      },
      {
        date: "2015-01-28",
        value: 4.199999809265137,
      },
      {
        date: "2015-01-29",
        value: 4.699999809265137,
      },
      {
        date: "2015-01-30",
        value: 3.799999952316284,
      },
      {
        date: "2015-01-31",
        value: 9.899999618530273,
      },
    ]; */

      let first = values[0].date;
      let maxValue = 0;
      let data = values.map((e) => {
        if (e.value > maxValue) maxValue = e.value;
        //console.log(differenceInDays(parseISO(e.date), parseISO(first)));
        return {
          x: differenceInDays(parseISO(e.date), parseISO(first)),
          y: e.value,
        };
      });
      //parseISO("2014-12-31")
      setData(data);
      setMaxValue(maxValue);
      setMinDate(parseISO(first));
      //lista.sort((a, b) => parseFloat(a.x) - parseFloat(b.x));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadParameters();
    loadPeriod();
    //alert("useEffect");
    return () => {
      //alert("unmount");
    };
  }, []);

  /*
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
  const screenWidth = Dimensions.get("window").width;
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [(20, 20), 45, 28, 80, 99],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Rainy Days"], // optional
  };
  */
  //intervals

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDate(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDate(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  const buttonHandler = async (e) => {
    //alert(differenceInDays(startDate, endDate));
    if (differenceInDays(endDate, startDate) > 30) {
      alert("Maximum allowed interval is 30 days");
      setEndDate(addDays(startDate, 30));
    } else {
      setLoading(true);
      await loadData();
      setLoading(false);
      setShowGraph(true);

      /*
      setTimeout(() => {
        setLoading(false);
        loadData();
        setShowGraph(true);
        //setShowGraph(true);
      }, 2000);
      */
      /*
     awaitloadData();
     setLoading(false);
     setShowGraph(true);
     */
    }
  };
  return (
    <View style={styles.container}>
      <View>
        <DropdownComponent
          setSelectedValue={setParameter}
          label={"name"}
          value={"id"}
          data={parameters}
        />
        {/*
          <Text>{parameter !== null && parameter.name}</Text>
        <Text>{location.name}</Text>
          */}
      </View>

      <DatePicker
        setDate={setStartDate}
        title={"Start of the interval"}
        min={parseISO(period.min)}
        max={parseISO(period.max)}
      />
      {
        //<Text>{format(startDate, "yyyy-mm-dd")}</Text>
      }

      <View>
        <DatePicker
          setDate={setEndDate}
          title={"End of the interval"}
          min={parseISO(period.min)}
          max={parseISO(period.max)}
        />
      </View>
      {/*
        <Text>{format(endDate, "yyyy-mm-dd").toString()}</Text>
      <Text>{differenceInDays(endDate, startDate)}</Text>
        */}

      <View>
        <Button
          title="Get stats"
          disabled={parameter === null}
          loading={loading}
          onPress={buttonHandler}
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
        />
      </View>
      {/*
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />
      */}
      {/*
      <Chart
        style={{ height: 200, width: "100%" }}
        data={[
          { x: -2, y: 15 },
          { x: -1, y: 10 },
          { x: 0, y: 12 },
          { x: 5, y: 8 },
          { x: 6, y: 12 },
          { x: 7, y: 14 },
          { x: 8, y: 12 },
          { x: 9, y: 13.5 },
          { x: 10, y: 18 },
        ]}
        padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
        xDomain={{ min: 0, max: 10 }}
        yDomain={{ min: 0, max: 20 }}
        viewport={{ size: { width: 5 } }}
      >
        <VerticalAxis
          tickValues={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]}
          theme={{
            axis: { stroke: { color: "#aaa", width: 2 } },
            ticks: { stroke: { color: "#aaa", width: 2 } },
            labels: { formatter: (v) => v.toFixed(2) },
          }}
        />
        <HorizontalAxis
          tickValues={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]}
          theme={{
            axis: { stroke: { color: "#aaa", width: 2 } },
            ticks: { stroke: { color: "#aaa", width: 2 } },
            labels: { label: { rotation: 50 }, formatter: (v) => v.toFixed(1) },
          }}
        />
        <Line
          theme={{
            stroke: { color: "red", width: 2 },
          }}
          smoothing="cubic-spline"
        />
        <Area
          theme={{
            gradient: {
              from: { color: "#f39c12", opacity: 0.4 },
              to: { color: "#f39c12", opacity: 0.4 },
            },
          }}
          smoothing="cubic-spline"
        />
      </Chart>
        */}
      {showGraph && (
        <Chart
          style={{ height: 200, width: "100%" }}
          data={data}
          padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
          xDomain={{ min: 0, max: 31 }}
          yDomain={{ min: 0, max: Math.ceil(maxValue) }}
          viewport={{ size: { width: 5 } }}
        >
          <VerticalAxis
            tickCount={10}
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
            tickCount={31}
            includeOriginTick={false}
            theme={{
              axis: { stroke: { color: "#00BFFF", width: 2 } },
              ticks: { stroke: { color: "#DCDCDC", width: 2 } },
              labels: {
                label: { color: "#FFF5EE", rotation: 0 },
                formatter: (v) => format(addDays(minDate, v), "2014-12-31"),
              },
            }}
          />
          <Line
            theme={{
              stroke: { color: "#E0FFFF", width: 2 },
            }}
            smoothing="cubic-spline"
          />
          <Area
            theme={{
              gradient: {
                from: { color: "#B0E0E6", opacity: 0.4 },
                to: { color: "#4169E1", opacity: 0.4 },
              },
            }}
            smoothing="cubic-spline"
          />
        </Chart>
      )}
      <Button
        title="Show more"
        onPress={toggleModal}
        disabled={!showGraph}
        buttonStyle={styles.modalButton}
      />

      <Modal isVisible={isModalVisible} backdropOpacity={0.9}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          {parameter !== null && (
            <Text>
              Values for parameter {parameter.name} from{" "}
              {format(startDate, "2014-12-31")} to{" "}
              {format(endDate, "2014-12-31")}
            </Text>
          )}
          <View>
            <Chart
              style={{ height: 200, width: 350 }}
              data={data}
              padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
              xDomain={{ min: -0, max: data.length - 1 }}
              yDomain={{ min: -0, max: maxValue }}
            >
              <VerticalAxis
                tickCount={9}
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
                tickValues={[0, 10, 20, 31]}
                theme={{
                  axis: { stroke: { color: "#00BFFF", width: 2 } },
                  ticks: { stroke: { color: "#DCDCDC", width: 2 } },
                  labels: {
                    label: { color: "#FFF5EE", rotation: 0 },
                    formatter: (v) => format(addDays(minDate, v), "2014-12-31"),
                  },
                }}
              />
              <Area
                theme={{
                  gradient: {
                    from: { color: "#B0E0E6" },
                    to: { color: "#4169E1", opacity: 0.2 },
                  },
                }}
              />
              <Line
                tooltipComponent={
                  <Tooltip formatter={{ formatter: (v) => v }} />
                }
                theme={{
                  stroke: { color: "#E0FFFF", width: 3 },
                  scatter: {
                    default: { width: 8, height: 8, rx: 6, color: "#6495ED" },
                    selected: { color: "red" },
                  },
                }}
              />
            </Chart>
          </View>
          <Button title="Hide more" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

export default StatsScreen;

/*
[
  {
    "x": 0,
    "y": 6.800000190734863
  },
  {
    "x": 1,
    "y": 3
  },
  {
    "x": 2,
    "y": 3.5
  },
  {
    "x": 3,
    "y": 4.400000095367432
  },
  {
    "x": 4,
    "y": 5.699999809265137
  },
  {
    "x": 5,
    "y": 5.099999904632568
  },
  {
    "x": 6,
    "y": 6.699999809265137
  },
  {
    "x": 7,
    "y": 4.800000190734863
  },
  {
    "x": 8,
    "y": 3.0999999046325684
  },
  {
    "x": 9,
    "y": 4.5
  },
  {
    "x": 10,
    "y": 4.300000190734863
  },
  {
    "x": 11,
    "y": 4.099999904632568
  },
  {
    "x": 12,
    "y": 7
  },
  {
    "x": 13,
    "y": 8
  },
  {
    "x": 14,
    "y": 7.400000095367432
  },
  {
    "x": 15,
    "y": 7.800000190734863
  },
  {
    "x": 16,
    "y": 7.599999904632568
  },
  {
    "x": 17,
    "y": 4
  },
  {
    "x": 18,
    "y": 1.899999976158142
  },
  {
    "x": 19,
    "y": 2.299999952316284
  },
  {
    "x": 20,
    "y": 2.4000000953674316
  },
  {
    "x": 21,
    "y": 2.799999952316284
  },
  {
    "x": 22,
    "y": 3
  },
  {
    "x": 23,
    "y": 1.899999976158142
  },
  {
    "x": 24,
    "y": 2.4000000953674316
  },
  {
    "x": 25,
    "y": 2.299999952316284
  },
  {
    "x": 26,
    "y": 3.9000000953674316
  },
  {
    "x": 27,
    "y": 2.0999999046325684
  },
  {
    "x": 28,
    "y": 4.199999809265137
  },
  {
    "x": 29,
    "y": 4.699999809265137
  },
  {
    "x": 30,
    "y": 3.799999952316284
  },
  {
    "x": 31,
    "y": 9.899999618530273
  }
]

*/

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
});
