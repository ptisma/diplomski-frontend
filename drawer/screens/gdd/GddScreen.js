//third party
import { StyleSheet, Text, View, Alert } from "react-native";
import { Button } from "react-native-elements";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  format,
  differenceInDays,
  addDays,
  parseISO,
  add,
  formatISO,
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

const GddScreen = () => {
  // hook to get location from the redux store
  const { location, set } = useSelector((state) => state.location.value);
  //state hook for loading spinner
  const [loading, setLoading] = useState(false);
  //state hook for gdd data
  const [data, setData] = useState([]);
  //state hook for accumulated gdd data
  const [accumulatedData, setAccumulatedData] = useState([]);
  //state hook for cultures data
  const [cultures, setCultures] = useState([]);
  //state hook for selected culture
  const [selectedCulture, setSelectedCulture] = useState(null);
  //state hook for showing and rendering graph
  const [showGraph, setShowGraph] = useState(false);

  //state hook for time period from API(mix and max date)
  const [period, setPeriod] = useState({});

  //state hooks for date pickers
  const [startDate, setStartDate] = useState(new Date(1598051730000));
  const [endDate, setEndDate] = useState(new Date(1598051730000));

  //state hooks for helper values for graph points
  const [maxValue, setMaxValue] = useState(0);
  const [maxAccumulatedValue, setMaxAccumulatedValue] = useState(0);
  const [minDate, setMinDate] = useState(null);

  //function which loads the minimum and maximum dates available from API's database
  const loadPeriod = async () => {
    try {
      const response = await axios.get(
        ROOT_URL + `/location/${location.id}` + `/microclimate/all/period`
      );
      let timePeriod = response.data;
      console.log(timePeriod);
      setPeriod(timePeriod);
      // setPeriod({
      //   min: "1990-01-01",
      //   max: "2022-12-31",
      // });
    } catch (error) {
      console.log(error);
    }
  };

  //function which loads the cultures
  const loadCultures = async () => {
    try {
      //fetch cultures
      /*  const cultures = await axios.get(ROOT_URL + "/culture/all");
      console.log(cultures.data);
      setCultures(cultures.data); */
      setCultures([
        {
          id: 1,
          name: "Barley",
        },
        {
          id: 2,
          name: "Maize",
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  //function which loads the component specific data (gdd)
  const loadData = async () => {
    console.log("loading");
    try {
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
      ];
      //map data to graph points, (x,y)
      let first = values[0].date;
      let maxValue = 0;
      let data = values.map((e) => {
        if (e.value > maxValue) maxValue = e.value;
        return {
          x: differenceInDays(parseISO(e.date), parseISO(first)),
          y: e.value,
        };
      });
      let currentSum = 0;
      let accumulatedData = data.map((e) => {
        currentSum = e.y + currentSum;
        return {
          x: e.x,
          y: currentSum,
        };
      });

      //console.log(accumulatedData);
      // console.log(maxAccumulatedValue);

      setData(data);
      setAccumulatedData(accumulatedData);
      setMaxValue(maxValue);
      setMaxAccumulatedValue(currentSum);
      setMinDate(parseISO(first));
    } catch (error) {
      console.log(error);
    }
  };

  //function which handles the get gdd button
  const buttonHandler = async (e) => {
    if (differenceInDays(endDate, startDate) > 30) {
      alert("Maximum allowed interval is 30 days");
      setEndDate(addDays(startDate, 30));
    } else {
      try {
        setLoading(true);
        await loadData();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setShowGraph(true);
      }
    }
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
      console.log("GDD mount");
      loadCultures();
      loadData();
      loadPeriod();
      return () => {
        console.log("GDD unmount");
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <View>
        <DropdownComponent
          setSelectedValue={setSelectedCulture}
          label={"name"}
          value={"id"}
          data={cultures}
        />
      </View>

      <DatePicker
        setDate={setStartDate}
        title={"Start of the interval"}
        min={parseISO(period.min)}
        max={parseISO(period.max)}
      />

      <View>
        <DatePicker
          setDate={setEndDate}
          title={"End of the interval"}
          min={parseISO(period.min)}
          max={parseISO(period.max)}
        />
      </View>

      <View>
        <Button
          title="Get growing degree day"
          disabled={selectedCulture === null}
          loading={loading}
          onPress={buttonHandler}
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
        />
      </View>

      {showGraph && (
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
            data={data}
            xDomain={{ min: 0, max: data.length - 1 }}
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
                  label: { color: "#21618C" },
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
                  label: { color: "#21618C", rotation: 0 },
                  formatter: (v) => format(addDays(minDate, v), "yyyy-MM-dd"),
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
          <Text style={styles.label}>Accumulated growing degree days(°C)</Text>
          <Chart
            style={{ height: styles.chart.height, width: styles.chart.width }}
            padding={{
              left: styles.chart.paddingLeft,
              right: styles.chart.paddingRight,
              top: styles.chart.paddingTop,
              bottom: styles.chart.paddingBottom,
            }}
            xDomain={{ min: 0, max: accumulatedData.length - 1 }}
            yDomain={{ min: 0, max: Math.ceil(maxAccumulatedValue) }}
          >
            <VerticalAxis
              tickCount={10}
              theme={{
                axis: { stroke: { color: "#00BFFF", width: 2.5 } },
                ticks: { stroke: { color: "#DCDCDC", width: 2 } },
                labels: {
                  label: { color: "#21618C", rotation: 0 },
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
                  formatter: (v) => {
                    {
                      //console.log(minDate);
                      //console.log(addDays(minDate, v));
                      //console.log(addDays(minDate, v).getDay());
                      //console.log(v);
                      return format(addDays(minDate, v), "yyyy-MM-dd");
                    }
                  },
                },
              }}
            />
            <Area
              theme={{
                gradient: {
                  from: { color: "#B0E0E6", opacity: 0.4 },
                  to: { color: "#4169E1", opacity: 0.4 },
                },
              }}
              smoothing="cubic-spline"
              data={accumulatedData}
            />
          </Chart>
        </View>
      )}
    </View>
  );
};

export default GddScreen;

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
    paddingTop: 20,
    paddingBottom: 20,
  },
  label: {
    textAlign: "center",
  },
});
