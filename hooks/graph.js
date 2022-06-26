import axios from "axios";
import {
  differenceInDays,
  format,
  isBefore,
  isSameDay,
  parseISO,
} from "date-fns";
import { useState } from "react";
import { ROOT_URL } from "../constants/URL";

const useDataApi = (url) => {
  const [historyData, setHistoryData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [value, setValue] = useState({ max: 0, min: 0 });
  const [minDate, setMinDate] = useState(null);
  const [isError, setIsError] = useState(false);

  const fetchPoints = async () => {
    // console.log("Inside fetch points");
    //setIsError(false);
    //setIsLoading(true);
    try {
      // console.log(url);
      const response = await axios.get(url);
      let values = response.data;
      //console.log("values:", values);
      let historyData = [];
      let predictedData = [];
      let currentDate = new Date();
      //console.log(currentDate);
      let firstDate = parseISO(values[0].date);
      let maxValue = Number.MIN_VALUE;
      let minValue = Number.MAX_VALUE;

      values.map((e) => {
        let parsedDate = parseISO(e.date);
        //console.log(parsedDate);
        let point = { x: differenceInDays(parsedDate, firstDate), y: e.value };
        //console.log(point);

        if (isSameDay(parsedDate, currentDate)) {
          //console.log("JEDNAKI:", point);
          predictedData.push(point); //no blank space in graph
        }

        if (isBefore(parsedDate, currentDate)) {
          //console.log("prije", point);
          historyData.push(point);
        } else {
          //console.log("kasnije", point);
          predictedData.push(point);
        }

        if (e.value > maxValue) maxValue = e.value;
        if (e.value < minValue) minValue = e.value;

        return point;
      });
      setIsError(false);
      setValue({ max: maxValue, min: minValue });
      // console.log({ max: maxValue, min: minValue });
      setMinDate(firstDate);
      setHistoryData(historyData);
      setPredictedData(predictedData);
      // console.log("over fetching points");
      //console.log(historyData, predictedData);
      // console.log("historyData:", historyData);
      // console.log("predictedData:", predictedData);
      // console.log("maxValue:", maxValue);
    } catch (error) {
      // console.log(error);
      setIsError(true);
    }
  };

  return [historyData, predictedData, value, minDate, isError, fetchPoints];
};

export default useDataApi;
