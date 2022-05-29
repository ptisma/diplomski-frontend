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
import { useFocusEffect } from "@react-navigation/native";
//local
import DatePicker from "../../../components/DateTimePicker/DatePicker";
import { ROOT_URL } from "../../../constants/URL";
import DropdownComponent from "../../../components/DropDownComponent/DropDownComponent";
import useTimePeriod from "../../../hooks/period";

const StatsScreen = ({ navigation }) => {
  // hook to get location from the redux store
  const { location, set } = useSelector((state) => state.location.value);
  //state hook for loading spinner
  const [loading, setLoading] = useState(false);
  //state hook for microclimate data
  const [data, setData] = useState([]);
  //state hook for microclimate data
  const [predictedData, setPredictedData] = useState([]);
  //state hook for microclimate parameters data
  const [parameters, setParameters] = useState([]);
  //state hook for selected microclimate parameter
  const [parameter, setParameter] = useState(null);
  //state hook for showing and rendering graph
  const [showGraph, setShowGraph] = useState(false);

  //state hook for time period from API(mix and max date)
  //const [period, setPeriod] = useState({});
  const [period, error] = useTimePeriod(location.id);
  //state hooks for date pickers
  const [startDate, setStartDate] = useState(new Date(1598051730000));
  const [endDate, setEndDate] = useState(new Date(1598051730000));
  //state hooks for helper values for graph points
  const [maxValue, setMaxValue] = useState(0);
  const [minDate, setMinDate] = useState(null);
  //state hook for showing modal
  const [isModalVisible, setModalVisible] = useState(false);

  //function which sets the modal visible
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  //function which loads the microclimate parameters from API
  const loadParameters = async () => {
    try {
      console.log(ROOT_URL + "/microclimate");
      const response = await axios.get(ROOT_URL + "/microclimate");
      let parameters = response.data;
      setParameters(parameters);
      /* setParameters([
        {
          id: 1,
          name: "Radiation",
          unit: "MJ/m2",
        },
        {
          id: 2,
          name: "Maximum temperature",
          unit: "ºC",
        },
        {
          id: 3,
          name: "Minimum temperature",
          unit: "ºC",
        },
        {
          id: 4,
          name: "Rain",
          unit: "mm",
        },
        {
          id: 5,
          name: "Wind",
          unit: "m/s",
        },
      ]); */
    } catch (error) {
      console.log(error);
    }
  };

  //function which loads the minimum and maximum dates available from API
  const loadPeriod = async () => {
    try {
      const response = await axios.get(
        ROOT_URL + `/location/${location.id}` + `/microclimate/all/period`
      );
      let timePeriod = response.data;
      console.log(timePeriod);
      setPeriod(timePeriod);
      /* setPeriod({
        min: "1990-01-01",
        max: "2022-12-31",
      }); */
    } catch (error) {
      console.log(error);
    }
  };

  //function which loads the component specific data (microclimate values)
  const loadData = async () => {
    try {
      console.log(
        ROOT_URL +
          "/microclimate" +
          `/location/${location.id}` +
          `/microclimate/${parameter.id}?from=${format(
            startDate,
            "yyyyMMdd"
          )}&to=${format(endDate, "yyyyMMdd")}`
      );

      const response = axios.get(
        ROOT_URL +
          "/microclimate" +
          `/location/${location.id}` +
          `/microclimate/${parameter.id}?from=${format(
            startDate,
            "yyyyMMdd"
          )}&to=${format(endDate, "yyyyMMdd")}`
      );
      let value = response.data;
      /* console.log(startDate.toISOString(), endDate.toISOString());
      console.log(formatISO(startDate, "yyyy-mm-dd"));
      console.log({
        from: format(startDate, "yyyy-mm-dd"),
        to: format(endDate, "yyyy-mm-dd"),
        locationId: location.id,
      }); */
      /* const rez = await axios.post(
        ROOT_URL + "/microclimate" + `/${parameter.id}`,
        {
          from: formatISO(startDate, "yyyy-mm-dd"),
          to: formatISO(endDate, "yyyy-mm-dd"),
          locationId: location.id,
        }
      );
      const values = rez.data;
      console.log(values); */

      /*  const values = [
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
        {
          date: "2015-02-01",
          value: 9.899999618530273,
        },
        {
          date: "2015-02-02",
          value: 9.899999618530273,
        },
      ]; */
      let firstDate = parseISO(values[0].date);
      let currentDate = new Date();
      let data = [];
      let predictedData = [];
      let maxValue = 0;
      values.map((e) => {
        let parsedDate = parseISO(e.date);
        let point = { x: differenceInDays(parsedDate, firstDate), y: e.value };
        if (e.value > maxValue) maxValue += e.value;
        if (isBefore(parsedDate, currentDate)) {
          //console.log("prije", point);
          data.push(point);
        } else {
          //console.log("kasnije", point);
          predictedData.push(point);
        }
      });
      //console.log(data, predictedData);
      setData(data);
      setPredictedData(data);
      setMaxValue(maxValue);
      setMinDate(firstDate);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("Stats mount");
      loadParameters();
      loadData();
      //loadPeriod();
      return () => {
        console.log("Stats unmount");
      };
    }, [])
  );

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

  //function which handles the get stats button
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
    }
  };

  return <View style={styles.container}></View>;
};

export default StatsScreen;

const historyAreaStyle = {
  gradient: {
    from: { color: "#B0E0E6" },
    to: { color: "#4169E1", opacity: 0.4 },
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
  },
  modalLabel: {
    textAlign: "center",
    color: "#4169E1",
  },
});
